const router = require("express").Router(); 
const {enrollStudent} = require("../controller/enrollmentController");
const authGuard = require("../middleware/authGuard");
const isAdmin = require("../middleware/isAdmin");

router.post("/enroll", authGuard,isAdmin,enrollStudent);

module.exports=router; 