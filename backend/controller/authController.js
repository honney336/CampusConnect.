//required modules 
    const { escape } = require("mysql2");
    const {User} = require("../model");
    require("dotenv").config();
    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken");
    const {createActivityLog} = require('./activitylogController')


//only admin can create new user
const createuser = async(req, res) => {
    console.log(req.body)

    try{
        const {username , email , password, role} = req.body;
        if (!username || !email || !password || !role) {
            return res.status(400).json({success: false, message: "Please enter all the fields!"});

        }
        if(password.length< 8){
            return res.status(400).json({success: false, message:"Password must be at least 8 characters long"});
        }

        // const emailExist = User.findOne({where:{email:email}})
        // if (emailExist){
        //     console.log(email)
        //     return res.status(404).json({success:false, message: "email already exist"});

        // }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newuser = await User.create({
            username: username,
            email: email ,
            password: hashedPassword,
            role:role,
        });
        return res.status(200).json({success: true, user:newuser, message:"User Created!!"});

    }

    catch (error) { 
        return res.status(500).json({success: false, error:error});
    }

}

//All user can Login 
const login = async ( req, res)=> {
    console.log(req.body)
    
    try{ 
        const {email, password} = req.body; 
        const user = await User.findOne({where: {email: email}});
        if (!user) {
            return res.status(404).json({success: false, message: "user not found"});
            
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            await createActivityLog(user.id, 'login_failed', 'user', user.id, `Failed login attempt`, req);
            return res.status(401).json({success: false, message: "Invalid credentials"})

        }

        const token = jwt.sign(
            {id: user.id, email: user.email, role:user.role},
            process.env.JWT_TOKEN,
            {expiresIn:"24h"}

        );

        await createActivityLog(user.id, 'login', 'user', user.id, `User logged in successfully`, req);

        return res.status(200).json({
                success: true, message: "Login successful", token, user: {
                id: user.id, 
                username: user.username, 
                email: user.email, 

            }
        });

    }
    catch (error) {
        return res.status(500).json({success: false ,message: "Internal server error",  error:error.message});
    }
};

//admin can view all the User 
const getAlluser = async (req, res) =>{
    console.log(req.headers.authorization);
    try { 
        const users = await User.findAll({attributes:{exclude:['password']}});
        return res.status(200).json({success: true, message: "Users accounts", users:users});
        

    }

    catch (error){
        return res.status(500).json({error: "Error fetching users"});
    };
};

//Only Admin can update users
const updateUser = async (req, res) => {
    console.log("updateUser");
    const userId = req.params.id;

    try{ 
        const userExit = await User.findByPk(userId)
        if (userExit) {
            console.log("User exists");
            const {username , email , password} = req.body; 
            const salt = await bcrypt.genSalt(10); 
            const hashedPassword = await bcrypt.hash(password, salt); 
            const updateuser = await User.update({username: username , email: email, password: hashedPassword}, {where:{id: userId}}); 

             const updatedUser = await User.findByPk(userId, {
            attributes: ['id', 'username', 'email', 'role']
        });
            return res.status(200).json({success:true, message: "User updated!", User: updatedUser });
        } 
        
          
        else {
            return res.status(404).json({success:false , message: "User doesnot Exists"})
        }
    }
    catch (error){
         return res.status(500).json({success: false , message:"Internal Server Error!" , error:error});
    }
};  


//only admin can delete users
const deleteUser = async (req, res) => {
    console.log("test")
    const userId = req.params.id; 
    
    try{
        const userExist = await User.findByPk(userId); 
        if (userExist){
            console.log("user exist"); 
           // const {username , email, password} = req.body; 
            const deleteuser = await User.destroy({where:{id:userId}, returning:true}); 
            return res.status(200).json({success: true , message :"user deleted",deleteuser});

        }


        else {
            return res.status(404).json({
                success: false, 
                message: "User doesnot exists"
            });
        };

    }

    catch (error){
       return res.status(500).json({success: false, message:"Internal Server Error", error:error});
    };
};

//Only admin can view user

const findUserbyId = async (req, res) => {
    console.log("find user"); 
    const userId = req.params.id; 

    try {
        const userExist = await User.findOne({where: {id:userId}, attributes: {exclude: ['password']}});
        if(userExist){
            console.log("user Found");
            return res.status(200).json({success: true , message: "User Found" , userExist: userExist})
        }

        else { 
            console.log("User not Found");
            return res.status(404).json(
                {success: false , message: "User not Found"}
            )
        }

        
    }

    catch (error){
        return res.status(500).json({success: false , message: "Server error" , error: error.message})
    };
    
};

module.exports = {
    createuser, login, getAlluser, updateUser, deleteUser, findUserbyId
};

