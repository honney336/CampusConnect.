const isAdmin = (req, res, next) => { 
    console.log(req.user)
    if (req.user && req.user.role==="admin") {
        return next();
    };
    
    return  res.status(404).json({success: false, 
        message: "Only access to admin"
    });
};


module.exports = isAdmin; 

