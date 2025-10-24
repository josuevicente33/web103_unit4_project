// crud operations for the cars
import { pool }  from '../config/database.js';

const getAllCustomCars = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM custom_cars');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch custom cars' });
    }
};

const getCustomCarById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM custom_cars WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Custom car not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch custom car' });
    }
};

const createCustomCar = async (req, res) => {
    const { name, car_id, color_id, wheels_id, total_price, image_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO custom_cars (name, car_id, color_id, wheels_id, total_price, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, car_id, color_id, wheels_id, total_price, image_url]
        );
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create custom car' });
    }
};

const updateCustomCar = async (req, res) => {
    const { id } = req.params;
    const { car_id, color_id, wheels_id, total_price, image_url } = req.body;
    try {
        const result = await pool.query(
            'UPDATE custom_cars SET car_id = $1, color_id = $2, wheels_id = $3, total_price = $4, image_url = $5 WHERE id = $6 RETURNING *',
            [car_id, color_id, wheels_id, total_price, image_url, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Custom car not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update custom car' });
    }
};

const deleteCustomCar = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM custom_cars WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Custom car not found' });
        }
        res.status(200).json({ message: 'Custom car deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete custom car' });
    }
};

export default { getAllCustomCars, getCustomCarById, createCustomCar, updateCustomCar, deleteCustomCar };