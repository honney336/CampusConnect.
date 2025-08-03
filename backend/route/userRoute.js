const router = require("express").Router(); 
const {changePassword, updateProfile}= require("../controller/userController"); 
const authGuard = require("../middleware/authGuard");

router.post("/change-password", authGuard, changePassword);
router.put("/update-profile", authGuard, updateProfile);

module.exports= router;
