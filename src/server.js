const { app, router } = require('./routes/routes')
app.use(router)

const validationRoute = require('./routes/validationRoute')
app.use(validationRoute)
app.listen(process.env.PORT, () => {
    console.log('server started')
})
