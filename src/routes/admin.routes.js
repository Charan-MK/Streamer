const express = require('express')
const router = new express.Router()
// const { app } = require('./routes')

const User = require('../db/userModel')
const auth = require('../middlewares/auth')
const isAdmin = require('../middlewares/admin')

router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find({})
        if (!users) return res.sendStatus(400)
        res.render('adminView', {
            users
        })
    } catch (error) {
        res.sendStatus(500)
    }
})

router.post('/users/update', auth, isAdmin, async (req, res) => {
    try {
        const { id, role } = req.body
        const user = await User.findOne({ _id: id })

        if (!user) {
            return res.sendStatus(400)
        }

        if (req.session.user._id === id) {
            return res.status(400).send('Admin cannot change his role by himself')
        }

        user.role = role
        await user.save()
        res.status(200).redirect('/users')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})
module.exports = router
