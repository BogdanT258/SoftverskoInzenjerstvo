import jwt from "jsonwebtoken";

export function authenticate(req,res,next){
    const header = req.headers.authorization;
    if(!header) return res.status(401).json({message:"Missing token"});

    const token = header.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET,(err, user)=>{
        if(err) return res.status(401).json({message:"Invalid token"});
        req.user = user;
        next();
    })
}

export function authorizeRoles(role){
    return (req,res,next)=>{
        if(req.user.role !== role){
            return res.status(403).json({message:"Forbidden"});
        }
        next();
    }
}