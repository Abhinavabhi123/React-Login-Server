const Admin = require("../model/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const { isObjectIdOrHexString } = require("mongoose");
module.exports = {
  postAdminLogin: async (req, res) => {
    let adminSignup = {
      Status: false,
      message: null,
      token: null,
      name: null,
    };
    const { email, password } = req.body;

    let adminData = await Admin.find({ email: email });

    if (adminData.length !== 0) {
      bcrypt.compare(
        password,
        adminData[0].password,
        function (error, isMatch) {
          if (error) {
            adminSignup.Status = false;
            adminSignup.message = error;
            res.send({ adminSignup });
          } else if (isMatch) {
            adminSignup.Status = true;
            adminSignup.name = adminData[0].Name;
            // const Adminname = adminData[0].name
            let AdminToken = jwt.sign({ id: adminData[0]._id }, "Secretcode", {
              expiresIn: "24h",
            });
            adminSignup.token = AdminToken;
            let obj = {
              AdminToken,
            };
            res
              .cookie("jwt", obj, {
                httpOnly: false,
                maxAge: 6000 * 1000,
              })
              .status(200)
              .send({ adminSignup });
          } else {
            adminSignup.message = "Password is wrong";
            adminSignup.Status = false;
            res.send({ adminSignup });
          }
        }
      );
    } else {
      adminSignup.message = "Your Email wrong";
      adminSignup.Status = false;
      res.send({ adminSignup });
    }
  },
  getUserDetails: async (req, res) => {
    try {
      const jwtToken = jwt.verify(req.cookies.jwt.AdminToken, "Secretcode");
      if (jwtToken) {
        User.find()
          .then((data) => {
            res.send({ data });
          })
          .catch((error) => {
            res.status(500).send({ error: error.message });
          });
      }
    } catch (error) {
      res.status(401).send({ error: "Unauthorized" });
    }
  },
  deleteUser: async (req, res) => {
    console.log(req.params.id, "is here");
    const jwtToken = jwt.verify(req.cookies.jwt.AdminToken, "Secretcode");
    if (jwtToken) {
      await User.deleteOne({ _id: req.params.id }).then(() => {
        console.log("deleted...");
        res.status(200);
      });
    }
  },
  editUser: async (req, res) => {
    const obj = {
      message: null,
      edited: null,
    };
    const jwtToken = jwt.verify(req.cookies.jwt.AdminToken, "Secretcode");
    if (jwtToken) {
      const { userId, editedUserFname, editedUserLname, editedUserEmail } =
        req.body;
      const userData = await User.find({ _id: userId });
      if (userData.length > 0) {
        User.updateOne(
          { _id: userId },
          {
            $set: {
              firstName: editedUserFname,
              lastName: editedUserLname,
              email: editedUserEmail,
            },
          }
        ).then(() => {
          obj.edited = true;
          res.status(200).send(obj);
        });
      } else {
        obj.message = "User not there";
      }
    }
  },
};
