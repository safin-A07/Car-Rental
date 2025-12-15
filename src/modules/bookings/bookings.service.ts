import { pool } from "../../database/db";

const createBookingIntoDB = async (payload: {
    customer_id: number;
    vehicle_id: number;
    rent_start_date: string;
    rent_end_date: string;
}) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    // get vehicle price
    const vehicleResult = await pool.query(
        `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1`,
        [vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    const vehicle = vehicleResult.rows[0];

    // calculate total days
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const days =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const total_price = days * Number(vehicle.daily_rent_price);

    // insert booking
    const bookingResult = await pool.query(
        `
        INSERT INTO bookings (
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
            total_price,
            status
        )
        VALUES ($1, $2, $3, $4, $5, 'active')
        RETURNING *;
        `,
        [
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
            total_price
        ]
    );

    return {
        ...bookingResult.rows[0],
        vehicle: {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price
        }
    };
};

const getAllBookingsFromDB = async (user: {
    id: number;
    role: string;
}) => {
    // ADMIN → see all bookings
    if (user.role === "admin") {
        const result = await pool.query(`
            SELECT
                b.id,
                b.customer_id,
                b.vehicle_id,
                b.rent_start_date,
                b.rent_end_date,
                b.total_price,
                b.status,
                json_build_object(
                    'name', u.name,
                    'email', u.email
                ) AS customer,
                json_build_object(
                    'vehicle_name', v.vehicle_name,
                    'registration_number', v.registration_number
                ) AS vehicle
            FROM bookings b
            JOIN users u ON b.customer_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.id
            ORDER BY b.id DESC;
        `);

        return {
            message: "Bookings retrieved successfully",
            data: result.rows
        };
    }

    // CUSTOMER → see own bookings only
    const result = await pool.query(`
        SELECT
            b.id,
            b.vehicle_id,
            b.rent_start_date,
            b.rent_end_date,
            b.total_price,
            b.status,
            json_build_object(
                'vehicle_name', v.vehicle_name,
                'registration_number', v.registration_number,
                'type', v.type
            ) AS vehicle
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.customer_id = $1
        ORDER BY b.id DESC;
    `, [user.id]);

    return {
        message: "Your bookings retrieved successfully",
        data: result.rows
    };
};

const updateBookingIntoDB = async (
    bookingId: number,
    status: string,
    user: any
) => {
    // 1. Find booking
    const bookingResult = await pool.query(
        `SELECT * FROM bookings WHERE id = $1`,
        [bookingId]
    );

    if (bookingResult.rows.length === 0) {
        throw new Error("Booking not found");
    }

    const booking = bookingResult.rows[0];

    // 2. CUSTOMER → cancel own booking
    if (user.role === "customer") {
        if (booking.customer_id !== user.id) {
            throw new Error("Unauthorized");
        }

        if (status !== "cancelled") {
            throw new Error("Invalid status");
        }

        await pool.query(
            `UPDATE bookings SET status = 'cancelled' WHERE id = $1`,
            [bookingId]
        );

        await pool.query(
            `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
            [booking.vehicle_id]
        );

        return {
            ...booking,
            status: "cancelled"
        };
    }

    // 3. ADMIN → mark as returned
    if (user.role === "admin") {
        if (status !== "returned") {
            throw new Error("Invalid status");
        }

        await pool.query(
            `UPDATE bookings SET status = 'returned' WHERE id = $1`,
            [bookingId]
        );

        await pool.query(
            `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
            [booking.vehicle_id]
        );

        return {
            ...booking,
            status: "returned",
            vehicle: {
                availability_status: "available"
            }
        };
    }
};



export const bookingService = {
    createBookingIntoDB,
    getAllBookingsFromDB,
    updateBookingIntoDB
};
