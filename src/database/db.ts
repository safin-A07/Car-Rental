import { Pool } from "pg";

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_3PTqkEz2YXdD@ep-rapid-haze-a8k3ga76-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require'
});

const initDB = async () => {
    await pool.query(
        `CREATE TABLE IF NOT EXISTS users (
         id SERIAL PRIMARY KEY,
         name VARCHAR(255) NOT NULL,
         email VARCHAR(255) NOT NULL UNIQUE,
         password VARCHAR(255) NOT NULL,
         phone VARCHAR(50) NOT NULL,
         role VARCHAR(20) NOT NULL CHECK (role IN ('admin','customer')),
         created_at TIMESTAMP DEFAULT now()
       );`
    )
    await pool.query(
        `CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('car','bike','van','SUV')),
        registration_number VARCHAR(100) NOT NULL UNIQUE,
        daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available','booked')),
        created_at TIMESTAMP DEFAULT now()
        );`
    )

    console.log("Database initialized");
}

export { pool, initDB };