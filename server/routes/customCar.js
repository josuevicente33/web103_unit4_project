import express from 'express';
import customCarController from '../controllers/customCarController.js';

const router = express.Router();

// CRUD Operations
router.get('/', customCarController.getAllCustomCars);
router.get('/:id', customCarController.getCustomCarById);
router.post('/', customCarController.createCustomCar);
router.put('/:id', customCarController.updateCustomCar);
router.delete('/:id', customCarController.deleteCustomCar);

export default router;