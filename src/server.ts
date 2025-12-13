
import express, { Request, Response } from "express"
import { Pool } from "pg";
import { userRoute } from "./modules/users/user.route";
import { initDB } from "./database/db";
import { vehicleRoute } from "./modules/vehicles/vehicles.route";
import { authRoute } from "./modules/auth/auth.route";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(express.json());




initDB();

// /api/v1/users
// User Route
app.use("/api/v1/users", userRoute);
//auth route
app.use("/api/v1/auth", authRoute);
// Vehicle Route
app.use("/api/v1/vehicles", vehicleRoute);


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Hello, World!",
        path: req.path
    })

});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});


















