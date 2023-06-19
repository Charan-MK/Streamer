const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const app = express()
const multer = require('multer')
const Video = require('../db/videoModel')
require('../db/mongoose')
const hbs = require('hbs')
const auth = require('../middlewares/auth')

const session = require('express-session')
// const MongoStore = require('connect-mongodb-session')(session)

// const store = new MongoStore({
//     uri: process.env.MONGOBD_URL,
//     collection: 'sessions'
// })

const cookieTimer = 60 * 2 * 1000

app.use(session({
    secret: 'mysecret',
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: cookieTimer }
}))

app.use(express.static(path.join(__dirname, '../../public')))
app.use(express.urlencoded())
app.use(express.json())

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../../views'))
hbs.registerPartials(path.join(__dirname, '../../views/partials'))

app.get('/', auth, async (req, res) => {
    res.status(200).render('home')
})

// fetch the video from Database
router.get('/db/videos', auth, async (req, res) => {
    const dBlist = await Video.find({})

    const dBvideos = []
    dBlist.forEach(vid => {
        dBvideos.push(vid.name)
    })
    res.status(200).render('dbList', {
        dbVideoList: dBvideos
    })
})

router.get('/db/videos/:dbVideoName', auth, async (req, res) => {
    res.status(200).render('dbVideos', {
        dbVideoName: req.params.dbVideoName
    })
})

// RETRIEVING MEDIA FROM MONGODB DTATABASE
router.get('/db/videos/play/:dbVideoName', auth, async (req, res) => {
    const video = await Video.find({ name: req.params.dbVideoName }) // fetches the specified video array

    if (video.length !== 0) {
        const dbVideo = video[0].video
        res.status(200).send(dbVideo)
    } else {
        res.status(400).send({ error: 'Video could not be found' })
    }
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 100000000
    },

    fileFilter (req, file, callback) {
        if (!file.originalname.match(/\.(mp4|mkv)$/)) {
            callback(new Error('file type must be .mp4 or .mkv'))
        }

        callback(undefined, true)
    }
})

const dBupload = multer({
    // storage: storage,
    limits: {
        fileSize: 15000000
    },

    fileFilter (req, file, callback) {
        if (!file.originalname.match(/\.(mp4|mkv)$/)) {
            callback(new Error('file type must be .mp4 or .mkv'))
        }

        callback(undefined, true)
    }
})

router.get('/upload', auth, (req, res) => {
    createAssetsDir()
    res.status(200).render('upload')
})

router.post('/upload', auth, upload.single('my-video'), (req, res) => {
    res.status(200).render('upload_success')
})

router.get('/upload/db', auth, (req, res) => {
    res.status(200).render('dBupload')
})

router.post('/upload/db', auth, dBupload.single('my-video'), async (req, res) => {
    const video = new Video({
        name: req.file.originalname,
        video: req.file.buffer
    })
    video.save()
    res.status(201).render('upload_success')
})

function createAssetsDir () {
    if (!fs.existsSync(path.join(__dirname, '../../assets'))) {
        console.log('creating a local directory to store media')
        fs.mkdirSync('./assets')
    }
}

let videoList = []

router.get('/localVideos', auth, (req, res) => {
    createAssetsDir()
    videoList = fs.readdirSync(path.join(__dirname, '../../assets'))
    res.status(200).render('videoList', { videoList })
})

router.get('/video/:videoName', auth, (req, res) => {
    res.render('videos', {
        videoName: req.params.videoName
    })
})

router.get('/playVideo/:videoName', auth, (req, res) => {
    let range = req.headers.range
    // console.log("This is range", range)
    if (!range) {
        range = 'bytes=0-'
        // res.status(400).send("Requires Range header");
    }
    const videoPath = path.join(__dirname, '../../assets/' + req.params.videoName)
    const videoSize = fs.statSync(videoPath).size
    const CHUNK_SIZE = 10 ** 6
    const start = Number(range.replace(/\D/g, ''))
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
    const contentLength = end - start + 1
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4'
    }
    res.writeHead(206, headers)
    const videoStream = fs.createReadStream(videoPath, { start, end })
    videoStream.pipe(res)
})

module.exports = {
    router,
    app
}
