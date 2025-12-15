import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(process.cwd(),".env")});
const config = {
    jwtSecret : process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL
}
export default config ;