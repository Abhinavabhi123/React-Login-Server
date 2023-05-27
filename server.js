const express = require("express");
const server = express();
const cors = require('cors')
const cookieParser =require("cookie-parser")
const adminRoute = require('./routes/adminRoute');
const userRoute =require("./routes/userRoute")
require('dotenv').config()
const connectDB = require("./config/dbConfig")
const port = process.env.PORT||4000;
const DB = process.env.DATABASE_URL
connectDB(DB)

server.use(express.urlencoded({extended:false}))
server.use(express.json())
server.use(express.static("public"))
server.use(cookieParser())

server.use(cors({
    origin:["http://localhost:3000"],
    methods:['GET','POST'],
    credentials:true
}))

// user Route
server.use("/",userRoute);
// admin Route
server.use("/admin",adminRoute)

server.listen(port,()=>{
    console.log(`server is running in port:${port}`);
})

module.exports =server;