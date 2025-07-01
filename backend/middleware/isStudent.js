const isStudent = (req, res, next) => {
    console.log(req.user); 

    if(req.user && req.user.role === "student"){
        return next();

    }

     return  res.status(404).json({success: false, 
        message: "Only student can access this route"
    });

}

module.exports= isStudent; 
