const User = require('../db/userModel')
const bcrypt = require('bcryptjs')

const auth = async (req, res, next) => {
    try {
        if (req.header('Authorization')) {
            const encodedCred = JSON.stringify(req.header('Authorization').split(' ')[1])

            // eslint-disable-next-line new-cap
            const buff = new Buffer.from(encodedCred, 'base64')
            const decodedCred = buff.toString('ascii')

            const [username, password] = decodedCred.split(':')
            const user = await User.findOne({ username })

            if (!user) {
                return res.sendStatus(400)
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                res.sendStatus(400)
            }

            req.session.user = user
            next()
        } else {
            if (!req.session.user) {
                return res.status(401).redirect('/login')
            }
            next()
        }
    } catch (error) {
        res.sendStatus(500)
    }
}

module.exports = auth
