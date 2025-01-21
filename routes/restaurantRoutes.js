import express from 'express';
import { 
  createRestaurant, 
  getRestaurants, 
  getRestaurant, 
  updateRestaurant, 
  deleteRestaurant 
} from '../controllers/restaurantControllers.js';
import {userAuth} from '../middlewares/userAuth.js';
import {adminAuth} from '../middlewares/adminAuth.js';

const router = express.Router();

// Create a restaurant (Admin only)
router.post('/',userAuth, adminAuth, createRestaurant);

// Get all restaurants
router.get('/', getRestaurants);

// Get a single restaurant by ID
router.get('/:id', getRestaurant);

// Update a restaurant (Admin only)
router.put('/:id', userAuth,adminAuth, updateRestaurant);

// Delete a restaurant (Admin only)
router.delete('/:id', userAuth, adminAuth, deleteRestaurant);

export { router as restaurantRouter };
