const auth = async (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).redirect('/login')
    }
    next()
}

module.exports = auth
