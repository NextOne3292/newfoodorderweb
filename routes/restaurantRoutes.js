import express from "express";
import { 
    getAllRestaurants, 
    getRestaurantById, 
    createRestaurant, 
    updateRestaurant, 
    deleteRestaurant 
} from "../controllers/restaurantControllers.js";
import { adminAuth } from "../middlewares/adminAuth.js";

import { upload } from "../middlewares/multer.js";

const router = express.Router();

// Public routes
router.get("/", getAllRestaurants); // Get all restaurants
router.get("/:id", getRestaurantById); // Get restaurant by ID

// Admin-only routes
router.post("/", adminAuth, upload.single("image"), createRestaurant); // Add a restaurant
router.put("/:id", adminAuth, upload.single("image"), updateRestaurant); // Update a restaurant
router.delete("/:id", adminAuth, deleteRestaurant); // Delete a restaurant

export { router as restaurantRouter };
