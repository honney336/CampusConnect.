
const router = require("express").Router();
const {createuser, getAlluser, findUserbyId, updateUser, deleteUser} = require("../controller/authController");
const authGuard = require("../middleware/authGuard");
const isAdmin = require("../middleware/isAdmin");


router.post("/register", createuser);
// router.post("/login", login);
router.get("/getuser",authGuard,isAdmin,getAlluser);
router.put("/update/:id", authGuard,isAdmin,updateUser);
router.delete("/deleteUser/:id", authGuard,isAdmin,deleteUser);
router.get("/searchuser/:id", authGuard,isAdmin,findUserbyId);

module.exports= router; 
