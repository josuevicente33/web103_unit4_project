import './dotenv.js'
import { pool } from './database.js'
import data from  '../data/data.js'

async function resetDB() {
    try {
        await pool.query(`
        DROP TABLE IF EXISTS custom_items;
        CREATE TABLE custom_items (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            price NUMERIC(10, 2) NOT NULL,
            image_url TEXT
        );
        `);
        console.log("Tables created successfully.");
        for (const item of data) {
            const { name, description, price, image_url } = item;
            await pool.query(
                'INSERT INTO custom_items (name, description, price, image_url) VALUES ($1, $2, $3, $4)',
                [name, description, price, image_url]
            );
        }
    } catch (error) {
        console.error("Error resetting database:", error);
    } finally {
        await pool.end();
    }
}

resetDB();        console.log("Sample data inserted successfully.");