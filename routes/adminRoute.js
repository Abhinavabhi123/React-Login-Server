const express = require("express");
const admin_route = express();
const adminController = require("../controller/admincontroller")


admin_route.post("/login",adminController.postAdminLogin)
admin_route.get("/getUserDetails",adminController.getUserDetails)
admin_route.get("/deleteUser/:id",adminController.deleteUser)
admin_route.post("/editUser",adminController.editUser)
module.exports = admin_route