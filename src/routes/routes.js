const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const app = express()
const hbs = require('hbs')
const session = require('express-session')

require('../db/mongoose')

// import all the middlewares
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const isNotLoggedIn = require('../middlewares/isNotLoggedIn')
const { dBupload, upload, createAssetsDir } = require('../middlewares/multer.config')

// import controllers to handle routes activities
const { getDatabaseVideosList, getDatabaseVideo, uploadVideoToDatabase } = require('../controllers/video.service.controller')
const { getStotageVideoList } = require('../controllers/storage.service.controller')

// set up MongoStore to store user sessions
const MongoStore = require('connect-mongodb-session')(session)
const store = new MongoStore({
    uri: process.env.MONGOBD_URL,
    collection: 'sessions'
})

// set up cookies to establisg session
const constants = require('../utils/constants')
const cookieTimer = constants.cookieTimer
app.use(session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: cookieTimer },
    store
}))

// setup middleware to read static files from public folder
app.use(express.static(path.join(__dirname, '../../public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// set the view engine:hbs to render the views to app UI
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../../views'))
hbs.registerPartials(path.join(__dirname, '../../views/partials'))
hbs.registerHelper('ifCdn', function (op1, op2, options) {
    if (op1 === op2) {
        return options.fn(this)
    } else {
        return options.inverse(this)
    }
})

// load the landing page of the app for login or signup
router.get('/', isNotLoggedIn, (req, res) => {
    res.render('landing')
})

// load the home page of the app
router.get('/home', auth, async (req, res) => {
    res.status(200).render('home', {
        user: req.session.user
    })
})

// fetch the video list from Database and render the list in UI
router.get('/db/videos', auth, async (req, res) => {
    const databaseVideosList = await getDatabaseVideosList()
    res.status(200).render('dbList', {
        dbVideoList: databaseVideosList
    })
})

// plays the requested video from database
router.get('/db/videos/:dbVideoName', auth, async (req, res) => {
    res.status(200).render('dbVideos', {
        dbVideoName: req.params.dbVideoName
    })
})

// fetches the multipart data required to play the requested video from database
router.get('/db/videos/play/:dbVideoName', auth, async (req, res) => {
    const videoName = req.params.dbVideoName
    const databaseVideo = await getDatabaseVideo(videoName)

    if (!databaseVideo) {
        res.status(400).send({ error: 'Video could not be found' })
    }
    res.status(200).send(databaseVideo)
})

// renders app view to upload video to storage service
router.get('/upload', auth, admin, (req, res) => {
    createAssetsDir()
    res.status(200).render('upload', {
        user: req.session.user
    })
})

// uploads video to storage service
router.post('/upload', auth, admin, upload.single('my-video'), (req, res) => {
    res.status(200).render('upload_success')
})

// renders app view to upload video to database
router.get('/upload/db', admin, auth, (req, res) => {
    res.status(200).render('dBupload', {
        user: req.session.user
    })
})

// uploads video to database
router.post('/upload/db', admin, auth, dBupload.single('my-video'), async (req, res) => {
    const { originalname, buffer } = req.file
    const uploadResult = await uploadVideoToDatabase(originalname, buffer)

    if (uploadResult === 'success') {
        res.status(201).render('upload_success')
    } else {
        res.status(500).json({ result: uploadResult })
    }
})

// renders the list of videos from storage service
router.get('/localVideos', auth, async (req, res) => {
    createAssetsDir()
    const storageVideosList = await getStotageVideoList()
    res.status(200).render('videoList', { videoList: storageVideosList })
})

// plays the requested video from storage service
router.get('/video/:videoName', auth, (req, res) => {
    res.render('videos', {
        videoName: req.params.videoName
    })
})

// fetches the multipart data required to play the requested video from storage service
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
