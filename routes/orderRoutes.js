import express from 'express';
import { createOrder, getOrders, getOrder, updateOrderStatus, deleteOrder } from '../controllers/orderControllers.js';
import {userAuth} from '../middlewares/userAuth.js';
import {adminAuth} from '../middlewares/adminAuth.js';

const router = express.Router();

// Create an order (protected route for authenticated users)
router.post('/', userAuth, createOrder);

// Get all orders (admin only)
router.get('/', userAuth, adminAuth, getOrders);

// Get a specific order by ID (protected route for authenticated users)
router.get('/:id', userAuth, getOrder);

// Update order status (admin only)
router.put('/:id/status', userAuth, adminAuth, updateOrderStatus);

// Delete an order (admin only)
router.delete('/:id', userAuth, adminAuth, deleteOrder);

export { router as orderRouter };
