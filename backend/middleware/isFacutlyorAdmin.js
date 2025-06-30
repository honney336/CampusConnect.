const isFacultyorAdmin = (req, res, next) => {
    console.log(req.user); 

    if(req.user && req.user.role === "faculty" || req.user && req.user.role === "admin"){
        return next();

    }

     return  res.status(404).json({success: false, 
        message: "Only access to faculty or Admin"
    });

}

module.exports= isFacultyorAdmin; 
