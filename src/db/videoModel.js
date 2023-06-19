const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    video: {
        type: Buffer,
        required: true
    }
},
{
    timestamps: true
}
)

const Video = mongoose.model('Video', videoSchema)

module.exports = Video
