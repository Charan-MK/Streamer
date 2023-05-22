const express = require('express')
const router = new express.Router()
const { app } = require('./routes')

const User = require('../db/userModel')
const bcrypt = require('bcryptjs')

app.use(express.json())

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).send({ error: 'Require details' })
        }
        const user = new User(req.body)
        await user.save()
        req.session.user = user
        res.status(201).redirect('/')
    } catch (error) {
        console.error(error)
        res.status(500).send('Something went wrong')
    }
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    const user = await User.find({ username: req.body.username })
    const isMatch = await bcrypt.compare(req.body.password, user[0].password)

    if (isMatch) {
        req.session.user = user
        return res.redirect('/')
    }
    res.status(401).send('unautherized')
})

module.exports = router
