const bcrypt = require("bcrypt");
const User = require("../model/usermodel"); 
const {createActivityLog} = require("./activitylogController")


// Login user can change their password
const changePassword = async (req, res) => {
    console.log(req.body);
    try {
        const userId = req.user.id; 
        const {oldpassword , newpassword} = req.body ; 

        if (!oldpassword || !newpassword){
            res.status(400).json({success: false, message: "Provide both oldpassword and newpassword!"}); 


        }

        const user = await User.findByPk(userId);

        if(!user){
           return res.status(404).json({success: false , message: "User not found!"}); 

        }

        const isMatch = await bcrypt.compare(oldpassword, user.password); 
        console.log(user.password)
        if (!isMatch){
           return res.status(401).json({success: false, message: "Old password didnot match"});
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(newpassword, salt); 
        console.log("checked!")
        user.password = hashedPassword; 
        await user.save(); 

        await createActivityLog(userId, 'password_changed', 'user', userId, `User changed password`, req);

       return  res.status(200).json({success: true, message: "Password changed successfully."}); 

    }
   catch (error){
    return res.status(500).json({success: false, message: "Internal server error!", error: error.message});
   };
};

module.exports = {changePassword}; 
