import express from 'express';


import { userRouter } from './userRoutes.js';
import { restaurantRouter } from './restaurantRouter.js';

import { orderRouter } from './orderRoutes.js';
import { menuRouter } from './menuRoutes.js';
import { searchRouter } from "./searchRouter.js";
import { cartRouter } from './cartRoutes.js';
import { addressRouter} from './addressRoutes.js';
import { adminRouter } from './adminRoutes.js';
import { paymentRouter } from './paymentRoutes.js';
import { globalSearchRouter } from './globalSearchRoutes.js';
const router = express.Router();

// User routes
router.use('/user', userRouter);

// Restaurant routes
router.use('/restaurants', restaurantRouter);

// Payment routes

// Order routes
router.use('/orders', orderRouter);

// Menu routes
router.use('/menu', menuRouter);
router.use('/search', searchRouter); // Add the search route



// Cart routes
router.use('/cart', cartRouter);
router.use('/address', addressRouter);
router.use('/payment', paymentRouter);

// Admin routes
router.use('/admin', adminRouter);
router.use('/admin/search', globalSearchRouter);
export { router as apiRouter };
