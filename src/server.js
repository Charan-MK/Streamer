const {app, router}  = require('./routes')
app.use(router)

app.listen(process.env.PORT, ()=>{
    console.log('server started')
})
