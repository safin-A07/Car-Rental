import { NextFunction, Request, Response } from "express";

const verify = (req :Request, res : Response, next: NextFunction    ) => {
    const ID = false ;
    if(!ID){
        return res.status(401).json({
            success: false,
            message: "Wait where is your id card"
        });
    }
    next();
}
export default verify ;