import express from "express";
import { upload } from "../middlewares/multer.js";
import { 
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    deleteAllRestaurants,
    
} from "../controllers/restaurantControllers.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

// ✅ Public Routes

router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);

// ✅ Admin Routes with Image Uploads
router.post("/", adminAuth, upload.single("image"), createRestaurant);
router.put("/:id", adminAuth, upload.single("image"), updateRestaurant);

// ✅ Delete Routes

router.delete("/", adminAuth, deleteAllRestaurants); // ✅ Delete all restaurants
router.delete("/:id", adminAuth, deleteRestaurant);
export { router as restaurantRouter };
