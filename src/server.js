const { app, router } = require('./routes/routes')
app.use(router)

const validationRoute = require('./routes/validationRoute')
const adminRoute = require('./routes/admin.routes')

app.use(adminRoute)
app.use(validationRoute)
app.listen(process.env.PORT, () => {
    console.log('server started in port', process.env.PORT)
})
