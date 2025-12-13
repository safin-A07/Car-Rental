import { Request, Response } from "express";
import { vehicleService } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const vehicle = await vehicleService.createVehicleIntoDB(req.body);

        return res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: vehicle
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllVehicle = async (req: Request, res: Response) => {
    try {
        const vehicles = await vehicleService.getAllVehicles();

        return res.status(200).json({
            success: true,
            message: vehicles.length
                ? "Vehicles retrieved successfully"
                : "No vehicles found",
            data: vehicles
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getVehicleById = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;

        const vehicle = await vehicleService.getVehicleByIdFromDB(
            Number(vehicleId)
        );

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: vehicle
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const updateVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;
        const payload = req.body;

        const updatedVehicle = await vehicleService.updateVehicleInDB(
            Number(vehicleId),
            payload
        );

        if (!updatedVehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: updatedVehicle
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;

        const deleted = await vehicleService.deleteVehicleFromDB(Number(vehicleId));

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
export const vehicleController = {
    createVehicle,
    getAllVehicle,
    getVehicleById,
    updateVehicle,
    deleteVehicle
};
