import express from 'express';
import { processPayment, getPaymentStatus } from '../controllers/paymentControllers.js';
import {userAuth} from '../middlewares/userAuth.js';

const router = express.Router();

// Process a payment (protected route)
router.post('/', userAuth, processPayment);

// Get payment status by order ID (protected route)
router.get('/:orderId', userAuth, getPaymentStatus);

export { router as paymentRouter };
