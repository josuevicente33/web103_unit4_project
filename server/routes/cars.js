import express from 'express';
import carsController from '../controllers/cars.js';

const router = express.Router();

router.get('/', carsController.getAllCars);
router.get('/:id', carsController.getCarById);

export default router;