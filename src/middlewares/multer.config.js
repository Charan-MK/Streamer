const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

function createAssetsDir () {
    if (!fs.existsSync(path.join(__dirname, '../../assets'))) {
        console.log('creating a local directory to store media')
        fs.mkdirSync('./assets')
    }
}

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

module.exports = { dBupload, upload, createAssetsDir }
