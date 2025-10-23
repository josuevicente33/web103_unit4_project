import express from 'express';
import colorsController from '../controllers/colors.js';

const router = express.Router();

// get colors and get by id
router.get('/', colorsController.getAllColors);
router.get('/:id', colorsController.getColorById);

export default router;