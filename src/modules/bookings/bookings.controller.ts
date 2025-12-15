import { Request, Response } from "express";
import { bookingService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingService.createBookingIntoDB({
            customer_id: req.body.customer_id,
            vehicle_id: req.body.vehicle_id,
            rent_start_date: req.body.rent_start_date,
            rent_end_date: req.body.rent_end_date
        });

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        const result = await bookingService.getAllBookingsFromDB(user);

        return res.status(200).json({
            success: true,
            message:
                user.role === "admin"
                    ? "Bookings retrieved successfully"
                    : "Your bookings retrieved successfully",
            data: result
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = Number(req.params.bookingId);
        const { status } = req.body;
        const user = (req as any).user;

        const result = await bookingService.updateBookingIntoDB(
            bookingId,
            status,
            user
        );

        return res.status(200).json({
            success: true,
            message:
                status === "cancelled"
                    ? "Booking cancelled successfully"
                    : "Booking marked as returned. Vehicle is now available",
            data: result
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const bookingController = {
    createBooking,
    getAllBookings,
    updateBooking
};
