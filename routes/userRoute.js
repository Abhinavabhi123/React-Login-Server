const express =require("express");
const user_route = express();
const userController = require("../controller/userController")
const multer = require("multer")
const path = require('path')
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,"../public/profileImages"),function(error,success){
            if(error){
                console.log(error);
            }
        })
    },
    filename:function(req,file,cb){
        const name = Date.now()+"-"+file.originalname;
        cb(null,name,function(error,success){
            if(error){
                console.log(error);
            }
        })
    }
})
const upload = multer({storage:storage})
user_route.post('/signup',userController.postSignup)
user_route.post('/login',userController.postLogin);
user_route.get('/profile',userController.getProfile)
user_route.post("/editProfile",upload.single('image'),userController.editProfile)
module.exports=user_route