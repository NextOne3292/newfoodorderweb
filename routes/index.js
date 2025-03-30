import express from 'express';


import { userRouter } from './userRoutes.js';
import { restaurantRouter } from './restaurantRouter.js';
import { paymentRouter } from './paymentRoutes.js';
import { orderRouter } from './orderRoutes.js';
import { menuRouter } from './menuRoutes.js';
import { searchRouter } from "./searchRouter.js";
import { cartRouter } from './cartRoutes.js';
import { adminRouter } from './adminRoutes.js';

const router = express.Router();

// User routes
router.use('/user', userRouter);

// Restaurant routes
router.use('/restaurants', restaurantRouter);

// Payment routes
router.use('/payment', paymentRouter);

// Order routes
router.use('/orders', orderRouter);

// Menu routes
router.use('/menu', menuRouter);
router.use('/search', searchRouter); // Add the search route
// Coupon routes


// Cart routes
router.use('/cart', cartRouter);

// Admin routes
router.use('/admin', adminRouter);

export { router as apiRouter };
