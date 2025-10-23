import { pool }  from '../config/database.js';

const getAllCars = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cars');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cars' });
    }
};

const getCarById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch car' });
    }
};

export default { getAllCars, getCarById };