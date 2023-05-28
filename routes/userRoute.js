const express =require("express");
const user_route = express();
const userController = require("../controller/userController")


user_route.post('/signup',userController.postSignup)
user_route.post('/login',userController.postLogin);
user_route.get('/profile',userController.getProfile)
module.exports=user_route