const User = require('../db/userModel')
const bcrypt = require('bcryptjs')

async function getUser (req) {
    const response = {}
    try {
        if (!req.body.username || !req.body.password) {
            response.status = 400
            response.data = { error: 'bad request' }
        }

        const username = req.body.username.trim()
        const user = await User.findOne({ username })
        if (!user) {
            response.status = 401
            response.data = { message: 'Invalid credentials' }
            return response
        }
        const password = req.body.password.trim()
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            response.status = 200
            response.data = user
        } else {
            response.status = 401
            response.data = { message: 'Invalid credentials' }
        }
    } catch (error) {
        console.log('Error while user login')
        response.status = 500
        response.data = { message: 'Internal server error' }
    }

    return response
}

async function createUser (req) {
    const response = {}
    try {
        if (!req.body) {
            response.status = 400
            response.data = { error: 'Require details' }
        }
        const username = req.body.username.trim()
        let user = await User.find({ username })
        if (user.length !== 0) {
            response.status = 400
            response.data = { error: 'Bad request/Invalid credentials' }
            return response
        }
        user = new User(req.body)
        await user.save()
        response.status = 201
        response.data = user
    } catch (error) {
        console.error('Error while user sign up', error)
        response.status = 500
        response.data = { message: 'Something went wrong' }
    }

    return response
}

async function getAllUsers () {
    const response = {}
    try {
        const users = await User.find({})
        if (users) {
            response.status = 200
            response.data = users
            return response
        }
        response.status = 500
    } catch (error) {
        console.log('Error while fetching user list for admin view')
        response.status = 500
    }

    return response
}

async function updateUser (req) {
    const response = {}
    try {
        const { id, role } = req.body

        const hex = /[0-9A-Fa-f]{6}/g

        if (!hex.test(id)) {
            response.status = 400
            response.data = { message: 'Bad request, id is not a valid hex string' }
            return response
        }
        const user = await User.findOne({ _id: id })

        if (!user) {
            response.status = 400
            response.data = { message: 'Invalid credentials' }
            return response
        }

        if (req.session.user._id === id) {
            response.status = 400
            response.data = { message: 'Admin cannot change his role by himsel' }
            return response
        }

        user.role = role
        await user.save()
        response.status = 200
        response.data = { message: 'User updates successfully' }
    } catch (error) {
        console.log('Error while updating the users', error)
        response.status = 500
        response.data = { message: 'Internal server error' }
    }

    return response
}

module.exports = { getUser, createUser, getAllUsers, updateUser }
