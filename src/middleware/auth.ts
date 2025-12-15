import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

// higher order function .
const auth = (...roles :string[])=>{
    return (req : Request , res: Response , next : NextFunction)=>{
        const token = req.headers.authorization;
        
        if(!token){
            return res.status(500).json({message : "You are not allowed !"})
        }
        const decoded = jwt.verify(token , config.jwtSecret as string ) as JwtPayload;
        req.user = decoded ;
        if(roles.length && !roles.includes(decoded.role)){
            return res.status(500).json({
                error :"unauthorized!!",
            });
        }
        // console.log({decoded})
        next();
        
    }
}

export default auth ;