
const isAdmin = function (req, res, next) {
    if (req.session.user) {
        if (req.session.user.role === 'ADMIN') {
            next()
        } else {
            res.sendStatus(403)
        }
    } else {
        res.redirect('/login')
    }
}

module.exports = isAdmin
