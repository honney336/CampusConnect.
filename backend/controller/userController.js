// const bcrypt = require("bcrypt");
// const User = require("../model"); 
// const {createActivityLog} = require("./activitylogController")


// // Login user can change their password
// const changePassword = async (req, res) => {
//     console.log(req.body);
//     try {
//         const userId = req.user.id; 
//         const {oldpassword , newpassword} = req.body ; 

//         if (!oldpassword || !newpassword){
//             return res.status(400).json({success: false, message: "Provide both oldpassword and newpassword!"}); 


//         }

//         const user = await User.findByPk(userId);

//         if(!user){
//            return res.status(404).json({success: false , message: "User not found!"}); 

//         }

//         const isMatch = await bcrypt.compare(oldpassword, user.password); 
//         console.log(user.password)
//         if (!isMatch){
//            return res.status(401).json({success: false, message: "Old password didnot match"});
//         }

//         const salt = await bcrypt.genSalt(10); 
//         const hashedPassword = await bcrypt.hash(newpassword, salt); 
//         console.log("checked!")
//         user.password = hashedPassword; 
//         await user.save(); 

//         await createActivityLog(userId, 'password_changed', 'user', userId, `User changed password`, req);

//        return  res.status(200).json({success: true, message: "Password changed successfully."}); 

//     }
//    catch (error){
//     return res.status(500).json({success: false, message: "Internal server error!", error: error.message});
//    };
// };

// module.exports = {changePassword}; 

const bcrypt = require("bcrypt");
const { User } = require("../model"); 
const { createActivityLog } = require("./activitylogController");

const changePassword = async (req, res) => {
    console.log(req.body);
    try {
        const userId = req.user.id; 
        const { oldpassword, newpassword } = req.body; 

        if (!oldpassword || !newpassword) {
            return res.status(400).json({ success: false, message: "Provide both oldpassword and newpassword!" });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const isMatch = await bcrypt.compare(oldpassword, user.password); 
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Old password did not match" });
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(newpassword, salt); 
        user.password = hashedPassword; 
        await user.save(); 

        await createActivityLog(userId, 'password_changed', 'user', userId, `User changed password`, req);

        return res.status(200).json({ success: true, message: "Password changed successfully." }); 
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error!", error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email } = req.body;

        if (!username || !email) {
            return res.status(400).json({ success: false, message: "Username and email are required!" });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        // Check if username already exists (exclude current user)
        const existingUser = await User.findOne({ 
            where: { 
                username: username,
                id: { [require('sequelize').Op.ne]: userId }
            }
        });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already exists!" });
        }

        // Update user
        user.username = username;
        user.email = email;
        await user.save();

        await createActivityLog(userId, 'profile_updated', 'user', userId, `User updated profile`, req);

        return res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully.",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error!", error: error.message });
    }
};

module.exports = { changePassword, updateProfile };