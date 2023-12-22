const { roles } = require('../utils/roles')

try {
    const mongoose = require('mongoose')
    const validator = require('validator')
    const bcrypt = require('bcryptjs')
    const userSchema = new mongoose.Schema({
        name: {
            type: String,
            maxLength: 30,
            required: true,
            trim: true
        },

        username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minLength: 8,
            validate (value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Not a valid email')
                }
            }
        },

        password: {
            type: String,
            minLength: 8,
            required: true,
            validate (value) {
                const blackList = ['admin', 'password', 'welcome']
                if (blackList.indexOf(value) !== -1) {
                    throw new Error('Password cannot contain the entered string')
                }
            }
        },

        tokens: [{
            token: {
                type: String,
                required: true
            }
        }],

        role: {
            type: String,
            enum: [roles.admin, roles.moderator, roles.client],
            default: roles.client
        }
    })

    userSchema.pre('save', async function (next) {
        const user = this
        if (user.email === process.env.ADMIN_EMAIL) {
            user.role = 'ADMIN'
        }

        if (user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 8)
        }
        next()
    })

    const user = mongoose.model('User', userSchema)
    module.exports = user
} catch (error) {
    console.error(error)
}
