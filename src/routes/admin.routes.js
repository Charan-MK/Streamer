const express = require('express')
const router = new express.Router()
// const { app } = require('./routes')

const auth = require('../middlewares/auth')
const isAdmin = require('../middlewares/admin')

const { getAllUsers, updateUser } = require('../controllers/user.service.controller')

router.get('/users', auth, isAdmin, async (req, res) => {
    const response = await getAllUsers()

    if (response.status === 200) {
        return res.status(200).render('adminView', {
            users: response.data
        })
    }

    res.sendStatus(response.status)
})

router.post('/users/update', auth, isAdmin, async (req, res) => {
    const response = await updateUser(req)

    if (response.status === 200) {
        res.status(200).redirect('/users')
    }
})
module.exports = router
