import { Request, Response } from "express";
import { vehicleService } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.createVehicleIntoDB(req.body);

        return res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result.rows[0]
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal server error"                                                                        
        });
    }

}
export const vehicleController = {
    createVehicle
}