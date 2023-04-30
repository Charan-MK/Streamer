const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const app = express()
const multer = require('multer')
const Video = require('./db/videoModel')
require('./db/mongoose')
const sharp = require('sharp')
const hbs = require('hbs')

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded())
app.use(express.json())
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../views'))
hbs.registerPartials(path.join(__dirname,'../views/partials'))

// app.get('/', (req, res)=>{
//     res.status(200).render('home')
// })

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'assets')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100000000
    },

    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(mp4|mkv)$/)){
            callback(new Error("file type must be .mp4 or .mkv"))
        }

        callback(undefined, true)
    }
})

const dBupload = multer({
    // storage: storage,
    limits: {
        fileSize: 15000000
    },

    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(mp4|mkv)$/)){
            callback(new Error("file type must be .mp4 or .mkv"))
        }

        callback(undefined, true)
    }
})

router.get('/upload', (req, res)=>{
     createAssetsDir()
    res.render('upload')
})

router.post('/upload', upload.single('my-video'), (req, res)=>{
    res.send("Upload success")
})

router.get('/upload/db', (req, res)=>{
    res.render('dBupload')
})

router.post('/upload/db', dBupload.single('my-video'), async (req, res)=>{
    console.log("req.body: ",req.body, req.file)
    const video = new Video({
        name: req.file.originalname,
        video: req.file.buffer
    })
    let result = video.save()

    console.log("Result of uploading the file to db", result)

    res.status(201).send({"upload":"success"})
})

function createAssetsDir(){
    if(!fs.existsSync(path.join(__dirname, '../assets'))){
        console.log("creating a local directory to store media")
        fs.mkdirSync('./assets')
    }
}

let videoList =[]

router.get('/', (req, res)=>{
    console.log(fs.existsSync(path.join(__dirname, '../assets')))
    createAssetsDir()
    videoList = fs.readdirSync(path.join(__dirname, '../assets'))
    res.status(200).render('videoList', {videoList})
})

router.get('/video/:videoName', (req, res)=>{
    console.log(req.params)
    res.render('videos', {
        videoName: req.params.videoName
    })
})

router.get('/playVideo/:videoName', (req, res)=>{
    let range = req.headers.range;
    // console.log("This is range", range)
    if (!range) {
        range = 'bytes=0-'
        // res.status(400).send("Requires Range header");
    }
    const videoPath = path.join(__dirname, "../assets/"+req.params.videoName);
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
})

module.exports = {
    router: router,
    app: app
}