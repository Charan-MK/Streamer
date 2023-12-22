const path = require('path')
const fs = require('fs')

async function getStotageVideoList () {
    let storageVideosList = []
    try {
        storageVideosList = fs.readdirSync(path.join(__dirname, '../../assets'))
    } catch (error) {
        console.log('Error while loading video from storage service')
    }

    return storageVideosList
}

module.exports = { getStotageVideoList }
