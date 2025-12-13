import bcrypt from "bcryptjs";
import { pool } from "../../database/db";
import jwt from "jsonwebtoken";

export const secretKey = process.env.JWT_SECRET ||"default" ;

//signup
const signupUserIntoDB = async (payload: any) => {
    const { name, email, password, phone, role } = payload;

    
    const existing = await pool.query(
        `SELECT id FROM users WHERE email = $1`,
        [email]
    );
    if (existing.rows.length > 0) {
        throw new Error("Email already registered");
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `
        INSERT INTO users (name, email, password, phone, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, phone, role;
        `,
        [name, email, hashedPassword, phone, role]
    );

    return result.rows[0];
};

// LOGIN
const loginUserIntoDB = async (email: string, password: string) => {
    const userQuery = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

    if (userQuery.rows.length === 0) {
        throw new Error("User not found");
    }

    const user = userQuery.rows[0];

    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error("Invalid credentials");
    }

    
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    
    const token = jwt.sign(jwtPayload, secretKey, {
        expiresIn: "7d",
    });

    
    delete user.password;

    return {
        token,
        user,
    };
};

export const authService = {
    signupUserIntoDB,
    loginUserIntoDB,
};
