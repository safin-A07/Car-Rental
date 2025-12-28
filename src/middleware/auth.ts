import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
      }

      // Must be: "Bearer <token>"
      const [scheme, token] = authHeader.split(" ");

      if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Invalid authorization format" });
      }

      const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

export default auth;


//http://localhost:5000