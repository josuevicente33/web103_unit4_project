// wheels controller
import { pool }  from '../config/database.js';

const getAllWheels = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM wheels');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wheels' });
    }
};
const getWheelById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM wheels WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Wheel not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wheel' });
    }
};

export default { getAllWheels, getWheelById };