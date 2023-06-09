const express = require('express')
const router = new express.Router()
const { app } = require('./routes')

const User = require('../db/userModel')
const bcrypt = require('bcryptjs')
const auth = require('../middlewares/auth')

app.use(express.json())

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).send({ error: 'Require details' })
        }
        let user = await User.find({ username: req.body.username })
        if (user.length !== 0) {
            return res.status(400).send({ error: 'Bad request/Invalid credentials' })
        }
        user = new User(req.body)
        await user.save()
        req.session.user = user
        res.status(201).redirect('/home')
    } catch (error) {
        console.error(error)
        res.status(500).send('Something went wrong')
    }
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    if (!req.body.username || !req.body.password) return res.status(400).send({ error: 'bad request' })

    const user = await User.findOne({ username: req.body.username })

    if (!user) {
        return res.sendStatus(404)
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password)

    if (isMatch) {
        req.session.user = user
        return res.redirect('/home')
    }
    res.status(401).send('unauthorized')
})

router.get('/logout', auth, (req, res) => {
    req.session.destroy(() => {
        res.status(200).render('logout')
    })
})

module.exports = router
