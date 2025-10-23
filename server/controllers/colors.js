// get colors and get by id
import { pool }  from '../config/database.js';

const getAllColors = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM colors');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch colors' });
    }
};

const getColorById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM colors WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Color not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch color' });
    }
};
export default { getAllColors, getColorById };