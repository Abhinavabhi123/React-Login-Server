const express = require("express");
const admin_route = express();
const adminController = require("../controller/adminController")


admin_route.post("/login",adminController.postAdminLogin)
module.exports = admin_route