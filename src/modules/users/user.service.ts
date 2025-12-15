import bcrypt from "bcryptjs";
import { pool } from "../../database/db";



const getAllUserFromDB = async()=>{
     
        const result = await pool.query(`
       SELECT id , name , email, phone, role FROM users;
   `, );
   return result;
   
}
const getSingleUserFromDB = async(email : string)=>{
     
        const result = await pool.query(`
       SELECT id , name , email, phone, role FROM users WHERE email=$1;
   `, [email]);
   return result;
   
}

const updateUserIntoDB = async (
    userId: number,
    payload: Record<string, unknown>
) => {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    for (const key in payload) {
        fields.push(`${key} = $${index}`);
        values.push(payload[key]);
        index++;
    }

    if (!fields.length) {
        return null;
    }

    const result = await pool.query(
        `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE id = $${index}
        RETURNING id, name, email, phone, role;
        `,
        [...values, userId]
    );

    return result.rows[0];
};
const deleteUserFromDB = async (userId: number) => {
    const result = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING *`,
        [userId]
    );

    return result?.rowCount! > 0;
};
export const userService = {
    
    getAllUserFromDB,
    getSingleUserFromDB,
    updateUserIntoDB,
    deleteUserFromDB
}