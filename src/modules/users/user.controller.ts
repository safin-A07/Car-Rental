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

const updateUser = async (req: Request, res: Response) => {
    try {
        const targetUserId = Number(req.params.userId);
        const loggedInUser = req.user;

        if (!loggedInUser) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // 🔒 OWNERSHIP CHECK
        if (
            loggedInUser.role !== "admin" &&
            loggedInUser.id !== targetUserId
        ) {
            return res.status(403).json({
                success: false,
                message: "You can update only your own profile"
            });
        }

        // 🔒 Prevent customers from changing role
        if (
            loggedInUser.role === "customer" &&
            "role" in req.body
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot change role"
            });
        }

        const updatedUser = await userService.updateUserIntoDB(
            targetUserId,
            req.body
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });

    } catch {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const loggedInUser = req.user; // from JWT

        if (!loggedInUser) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

       
        if (
            loggedInUser.role !== "admin" &&
            loggedInUser.id !== userId
        ) {
            return res.status(403).json({
                success: false,
                message: "You can delete only your own account"
            });
        }

        const deleted = await userService.deleteUserFromDB(userId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error: any) {

        //  Booking FK protection error
        if (error.code === "23503") {
            return res.status(400).json({
                success: false,
                message: "User cannot be deleted because bookings exist"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



export const userController = {
    
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser
}