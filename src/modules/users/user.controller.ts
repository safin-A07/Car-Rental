import { Request, Response } from "express";

import { userService } from "./user.service";


const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUserFromDB();

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: result.rows
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

const getSingleUser = async (req: Request, res: Response) => {
    try {
        const email = req.user!.email;
        const result = await userService.getSingleUserFromDB(email);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: result.rows
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

export const userController = {
    
    getAllUser,
    getSingleUser
}