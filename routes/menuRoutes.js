import express from 'express';
import {
  createMenuItem,
  getMenuItemsByRestaurant,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuControllers.js';
import {userAuth} from '../middlewares/userAuth.js';
import {adminAuth} from '../middlewares/adminAuth.js';

const router = express.Router();

// Create a menu item (admin only)
router.post('/', userAuth, adminAuth, createMenuItem);

// Get all menu items for a specific restaurant
router.get('/restaurant/:restaurantId', getMenuItemsByRestaurant);

// Get a single menu item by ID
router.get('/:id', getMenuItem);

// Update a menu item (admin only)
router.put('/:id', userAuth, adminAuth, updateMenuItem);

// Delete a menu item (admin only)
router.delete('/:id', userAuth, adminAuth, deleteMenuItem);

export { router as menuRouter };
