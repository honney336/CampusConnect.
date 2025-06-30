const router = require("express").Router(); 
const {changePassword}= require("../controller/userController"); 
const authGuard = require("../middleware/authGuard");

router.post("/change-password", authGuard, changePassword );

module.exports= router; 
