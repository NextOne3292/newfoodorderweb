import express from "express";
import { upload } from "../middlewares/multer.js";

import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  deleteAllMenuItems
} from "../controllers/menuControllers.js";
import { adminAuth } from "../middlewares/adminAuth.js";



const router = express.Router();

// Public routes
router.get("/", getAllMenuItems); // Get all menu items
router.get("/:id", getMenuItemById); // Get menu item by ID

// Admin-only routes
router.post("/", adminAuth, upload.single("image"), createMenuItem); // Add a menu item
router.put("/:id", adminAuth, upload.single("image"), updateMenuItem); // Update a menu item
router.delete("/:id", adminAuth, deleteMenuItem); // Delete a menu item
// Admin-only route to delete all menu items
router.delete("/", adminAuth, deleteAllMenuItems); // DELETE request to `/api/menu/` will delete all menu items
export { router as menuRouter } ;
