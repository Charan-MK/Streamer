const { app, router } = require('./routes/routes')
app.use(router)

const validationRoute = require('./routes/validationRoute')
const adminRoute = require('./routes/admin.routes')

app.use(validationRoute)
app.use(adminRoute)

app.listen(process.env.PORT, () => {
    console.log(`server listening at: , http://localhost:${process.env.PORT}`)
})
