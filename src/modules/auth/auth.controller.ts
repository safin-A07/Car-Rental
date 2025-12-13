import  { Request, Response } from "express";
import { authService } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
     try {
           const result = await authService.signupUserIntoDB(req.body );
    
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: result
            });
        } catch (error) {
    
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    
}


const loginUser = async (req: Request, res: Response) => {
     try {
           const result = await authService.loginUserIntoDB(req.body.email , req.body.password);
    
            return res.status(201).json({
                success: true,
                message: "Login successful",
                data: result
            });
        } catch (error) {
    
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    
}

export const authController = {
    loginUser,
    signupUser
}
