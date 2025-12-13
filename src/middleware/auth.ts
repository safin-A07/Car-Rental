import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

export const auth = () => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({
                    success: false,
                    message: "Missing Authorization header"
                });
            }

            // Validate format: "Bearer token"
            const parts = authHeader.split(" ");

            if (parts.length !== 2 || parts[0] !== "Bearer") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Authorization header format. Use: Bearer <token>"
                });
            }

            const token = parts[1];

            // FIX: token is guaranteed string now
            
            const decoded = jwt.verify(token!, process.env.JWT_SECRET!);

            req.user = decoded;

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
    };
};

export const adminOnly = () => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only."
            });
        }
        next();
    };
};
