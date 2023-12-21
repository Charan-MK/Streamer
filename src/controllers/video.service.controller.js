const Video = require('../db/videoModel')

async function getDatabaseVideosList () {
    const databaseVideoList = await Video.find({})

    const databaseVideos = []
    databaseVideoList.forEach(vid => {
        databaseVideos.push(vid.name)
    })

    return databaseVideos
}

async function getDatabaseVideo (videoName) {
    const video = await Video.find({ name: videoName }) // fetches the specified video array

    if (video.length === 0) {
        return null
    }

    const databaseVideo = video[0].video
    return databaseVideo
}

async function uploadVideoToDatabase (originalname, buffer) {
    let result
    try {
        const video = new Video({
            name: originalname,
            video: buffer
        })
        video.save()
        result = 'success'
    } catch (error) {
        result = 'failure'
        console.log('Error while saving the video to database')
    }

    return result
}

module.exports = { getDatabaseVideosList, getDatabaseVideo, uploadVideoToDatabase }
