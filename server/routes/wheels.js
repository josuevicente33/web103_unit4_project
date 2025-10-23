import express from 'express';
import wheelsController from '../controllers/wheels.js';

const router = express.Router();

// get and get by id
router.get('/', wheelsController.getAllWheels);
router.get('/:id', wheelsController.getWheelById);

export default router;