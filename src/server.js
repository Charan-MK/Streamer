const {app, router}  = require('./routes')
const PORT = 8000
app.use(router)

app.listen(PORT, ()=>{
    console.log(`server listening at http://127.0.0.1:${PORT}`)
})
