import express from "express";
import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuControllers.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// Public routes
router.get("/", getAllMenuItems); // Get all menu items
router.get("/:id", getMenuItemById); // Get menu item by ID

// Admin-only routes
router.post("/", adminAuth, upload.single("image"), createMenuItem); // Add a menu item
router.put("/:id", adminAuth, upload.single("image"), updateMenuItem); // Update a menu item
router.delete("/:id", adminAuth, deleteMenuItem); // Delete a menu item

export { router as menuRouter } ;
