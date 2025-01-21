import express from 'express';
import {
  createCoupon,
  getCoupons,
  applyCoupon,
  deleteCoupon,
} from '../controllers/couponControllers.js';
import {userAuth} from '../middlewares/userAuth.js';
import {adminAuth} from '../middlewares/adminAuth.js';

const router = express.Router();

// Create a coupon (admin only)
router.post('/', userAuth, adminAuth, createCoupon);

// Get all coupons (public route)
router.get('/', getCoupons);

// Apply a coupon to the cart (protected route)
router.post('/apply', userAuth, applyCoupon);

// Delete a coupon (admin only)
router.delete('/:id', userAuth, adminAuth, deleteCoupon);

export { router as couponRouter };
