const express =require("express");
const user_route = express();
const userController = require("../controller/userController")


user_route.post('/signup',userController.postSignup)
user_route.post('/login',userController.postLogin);
module.exports=user_route