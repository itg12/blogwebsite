// require the necessary modules

const express = require("express")
const app = express()
const cors = require('cors')


// Use some Middlewares

app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET","POST","PUT", "DELETE", "PATCH"],  
}));
app.use(express.json())
app.use(require('./Routes/routes'))
app.use(express.static('uploads'))


// Environment variable configuration.
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const PORT = process.env.PORT


// Require the Database.
const DB = require('./DB/connection.js')


app.listen(PORT, ()=>{
    console.log("Server is started on PORT:",PORT)
})