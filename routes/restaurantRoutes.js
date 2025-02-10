import express from "express";
import { upload } from "../config/cloudinaryConfig.js"; // ✅ Import correctly

import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} from "../controllers/restaurantControllers.js";

const router = express.Router();

// ✅ Use Multer Middleware for Image Upload
router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", upload.single("image"), createRestaurant); // ✅ Upload image when creating
router.put("/:id", upload.single("image"), updateRestaurant); // ✅ Upload image when updating
router.delete("/:id", deleteRestaurant);

export { router as restaurantRouter };
