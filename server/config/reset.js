import './dotenv.js'
import { pool } from './database.js'
import data from  '../data/data.js'

async function createWheelsTable() {
    try {
        await pool.query(`
        DROP TABLE IF EXISTS wheels CASCADE;
        CREATE TABLE wheels (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            price NUMERIC(10, 2) NOT NULL,
            image_url TEXT
        );
        `);
        console.log("Wheels table created successfully.");
    } catch (error) {
        console.error("Error creating wheels table:", error);
    }
}

async function createColorsTable() {
    try {
        await pool.query(`
        DROP TABLE IF EXISTS colors CASCADE;
        CREATE TABLE colors (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            price NUMERIC(10, 2) NOT NULL,
            image_url TEXT
        );
        `);
        console.log("Colors table created successfully.");
    } catch (error) {
        console.error("Error creating colors table:", error);
    }
}

async function createCarsTable() {
    try {
        await pool.query(`
        DROP TABLE IF EXISTS cars CASCADE;
        CREATE TABLE cars (
            id SERIAL PRIMARY KEY,
            model VARCHAR(100) NOT NULL,
            description TEXT,
            base_price NUMERIC(10, 2) NOT NULL,
            image_url TEXT
        );
        `);
        console.log("Cars table created successfully.");
    } catch (error) {
        console.error("Error creating cars table:", error);
    }
}


async function createCustomCarsTable() {
    try {
        await pool.query(`
        DROP TABLE IF EXISTS custom_cars CASCADE;
        CREATE TABLE custom_cars (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            car_id INTEGER REFERENCES cars(id),
            color_id INTEGER REFERENCES colors(id),
            wheels_id INTEGER REFERENCES wheels(id),
            total_price NUMERIC(10, 2) NOT NULL,
            image_url TEXT
        );
        `);
        console.log("Custom cars table created successfully.");
    } catch (error) {
        console.error("Error creating custom cars table:", error);
    }
}

async function createCarWheelCompatibilityTable() {
    try {
        await pool.query(`
        DROP TABLE IF EXISTS car_wheel_compatibility CASCADE;
        CREATE TABLE car_wheel_compatibility (
            id SERIAL PRIMARY KEY,
            car_id INTEGER REFERENCES cars(id),
            wheel_id INTEGER REFERENCES wheels(id)
        );
        `);
        console.log("Car-Wheel Compatibility table created successfully.");
    } catch (error) {
        console.error("Error creating Car-Wheel Compatibility table:", error);
    }
}

async function insertInitialData() {
    try {
        for (const wheel of data.wheels) {
            await pool.query(
                'INSERT INTO wheels (name, description, price, image_url) VALUES ($1, $2, $3, $4)',
                [wheel.name, wheel.description, wheel.price, wheel.image_url]
            );
        }
        for (const color of data.colors) {
            await pool.query(
                'INSERT INTO colors (name, description, price, image_url) VALUES ($1, $2, $3, $4)',
                [color.name, color.description, color.price, color.image_url]
            );
        }
        for (const car of data.cars) {
            await pool.query(
                'INSERT INTO cars (model, description, base_price, image_url) VALUES ($1, $2, $3, $4)',
                [car.model, car.description, car.base_price, car.image_url]
            );
        }
        for (const compatibility of data.carWheelCompatibility) {
            const carResult = await pool.query(
                'SELECT id FROM cars WHERE model = $1',
                [compatibility.car_model]
            );
            const car_id = carResult.rows[0].id;
            const wheelResult = await pool.query(
                'SELECT id FROM wheels WHERE name = $1',
                [compatibility.wheel_name]
            );
            const wheel_id = wheelResult.rows[0].id;
            await pool.query(
                'INSERT INTO car_wheel_compatibility (car_id, wheel_id) VALUES ($1, $2)',
                [car_id, wheel_id]
            );
        }   
        console.log("Initial data inserted successfully.");
    } catch (error) {
        console.error("Error inserting initial data:", error);
    }
}

async function resetDatabase() {
    await createWheelsTable();
    await createColorsTable();
    await createCarsTable();
    await createCustomCarsTable();
    await createCarWheelCompatibilityTable();
    await insertInitialData();
    pool.end();
}

resetDatabase();