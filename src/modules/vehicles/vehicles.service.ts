import { pool } from "../../database/db";

const createVehicleIntoDB = async(payload : Record<string, unknown>)=>{
        const { vehicle_name , type , registration_number, daily_rent_price, availability_status } = payload;
        const result = await pool.query(`
       INSERT INTO vehicles (vehicle_name , type , registration_number, daily_rent_price, availability_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *;
   `, [ vehicle_name , type , registration_number, daily_rent_price, availability_status]);
   return result;
}

const getAllVehicles = async()=>{
    const result = await pool.query(`
        SELECT 
            id,
            vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status
        FROM vehicles;
    `);

    return result.rows;

}
const getVehicleByIdFromDB = async (vehicleId: number) => {
    const result = await pool.query(
        `
        SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status
        FROM vehicles
        WHERE id = $1
        `,
        [vehicleId]
    );

    return result.rows[0];
};

const updateVehicleInDB = async (
    vehicleId: number,
    payload: Record<string, unknown>
) => {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in payload) {
        fields.push(`${key} = $${index}`);
        values.push(payload[key]);
        index++;
    }

    if (fields.length === 0) {
        return null;
    }

    const query = `
        UPDATE vehicles
        SET ${fields.join(", ")}
        WHERE id = $${index}
        RETURNING 
            id,
            vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status;
    `;

    values.push(vehicleId);

    const result = await pool.query(query, values);
    return result.rows[0];
};
const deleteVehicleFromDB = async (vehicleId: number) => {
    const result = await pool.query(
        `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
        [vehicleId]
    );

    return result?.rowCount! > 0;
};
export const vehicleService = {
    createVehicleIntoDB ,
    getAllVehicles,
    getVehicleByIdFromDB,
    updateVehicleInDB,
    deleteVehicleFromDB
}