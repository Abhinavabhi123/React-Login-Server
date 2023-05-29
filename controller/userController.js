const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  postSignup: async (req, res) => {
    let userSignUp = {
      Status: false,
      message: null,
    };
    console.log(req.body);
    const { fname, lname, email } = req.body;
    let { password } = req.body;
    let user = await User.find({ email: email });
    if (user.length === 0) {
      password = await bcrypt.hash(password, 10);
      User.create({
        firstName: fname,
        lastName: lname,
        email: email,
        password: password,
      }).then((data) => {
        userSignUp.Status = true;
        res.send({ userSignUp });
      });
    } else {
      userSignUp.message = "Email Already Exists";
      res.send({ userSignUp });
    }
  },
  postLogin: async (req, res) => {
    let userLogin = {
      Status: false,
      message: null,
      token: null,
      name: null,
    };
    const { email, password } = req.body;
    let userData = await User.find({ email: email });
    console.log(userData, "dataaa");
    if (userData.length !== 0) {
      bcrypt.compare(password, userData[0].password, function (error, isMatch) {
        if (error) {
          userLogin.Status = false;
          userLogin.message = error;
          res.send({ userLogin });
        } else if (isMatch) {
          userLogin.Status = true;
          const userName = userData[0].firstName + " " + userData[0].lastName;
          console.log(userName);
          userLogin.name = userName;
          let token = jwt.sign({ id: userData[0]._id }, "secretCodeforUser", {
            expiresIn: "30d",
          });
          userLogin.token = token;
          let obj = {
            token,
            userName,
          };
          res
            .cookie("jwt", obj, {
              httpOnly: false,
              maxAge: 6000 * 1000,
            })
            .status(200)
            .send({ userLogin });
        } else {
          userLogin.message = "Password incorrect";
          userLogin.Status = false;
          res.send({ userLogin });
        }
      });
    } else {
      userLogin.message = "Your Email is wrong Check and try Again";
      userLogin.Status = false;
      res.send({ userLogin });
    }
  },
  getProfile: async (req, res) => {
    try {
      if (!req.cookies || !req.cookies.jwt) {
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        const jwtToken = req.cookies.jwt.token;
        const decodetoken = jwt.verify(jwtToken, "secretCodeforUser");

        const userId = decodetoken.id;
        const user = await User.find({ _id: userId });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        } else {
          return res.status(200).json({ user });
        }
      }
    } catch (error) {
      console.error("Error in userProfile", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  editProfile:async(req,res)=>{
    try {
        console.log("hello");
       const jwtToken = req.cookies.jwt.token;
       const decode=jwt.verify(jwtToken,"secretCodeforUser")
       console.log(decode);
        if(!decode.id){
            throw new Error("Invalid Token")
        }
        const userData = await User.findOne({_id:decode.id})

        if(!userData){
            throw new Error("User not found")
        }
        if(req.file&&req.file.path){
            userData.image=req.file.filename;
            console.log(userData);
            const url =req.file.path;
            await userData.save()
            console.log("success")
            res.status(200).send({success:true,url})
        }else{
            throw new Error("No image is there")
        }
        
    } catch (error) {
        res.status(500).json({error:'Internal server error'});
    }
  }
};
