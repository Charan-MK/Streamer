const express = require('express')
const router = new express.Router()
const { app } = require('./routes')

const auth = require('../middlewares/auth')

const { getUser, createUser } = require('../controllers/user.service.controller')

app.use(express.json())

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', async (req, res) => {
    const response = await createUser(req)
    if (response.status === 201) {
        req.session.user = response.data
        return res.redirect('/home')
    } else {
        res.status(response.status).send(response.data)
    }
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    const response = await getUser(req)
    if (response.status === 200) {
        req.session.user = response.data
        return res.redirect('/home')
    }
    res.status(response.status).send(response.data)
})

router.get('/logout', auth, (req, res) => {
    req.session.destroy(() => {
        res.status(200).render('logout')
    })
})

module.exports = router
