const Admin = require("../model/adminModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
module.exports={
    postAdminLogin:async(req,res)=>{
        let adminSignup={
            Status :false,
            message:null,
            token:null,
            name:null
        }
        const {email,password} =req.body;

        let adminData = await Admin.find({email:email})
        
        if(adminData.length !==0){
            bcrypt.compare(password,adminData[0].password,function(error,isMatch){
                if(error){
                    adminSignup.Status = false;
                    adminSignup.message = error;
                    res.send({adminSignup})
                }else if(isMatch){
                    adminSignup.Status=true;
                    adminSignup.name = adminData[0].Name
                    const Adminname = adminData[0].name
                    let AdminToken = jwt.sign({id:adminData[0]._id},"Secretcode",{expiresIn:"24h"})
                    adminSignup.token = AdminToken
                    let obj={
                        AdminToken,Adminname
                    }
                    res.cookie("jwt",obj,{
                        httpOnly:false,maxAge:6000*1000,
                    }).status(200).send({adminSignup})
                }else{
                    adminSignup.message="Password is wrong"
                    adminSignup.Status=false
                    res.send({adminSignup})
                }
            })
        }else{
            adminSignup.message = "Your Email wrong"
            adminSignup.Status= false
            res.send({adminSignup})
        }
    },
}