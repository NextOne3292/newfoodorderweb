import express from "express";
import { addToCart, getCart, updateCart, clearCart } from "../controllers/cartControllers.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = express.Router();

// Add item to cart
router.post("/", userAuth, addToCart);

// Get user's cart
router.get("/", userAuth, getCart);

// Update cart item quantity
router.put("/:menuItemId", userAuth, updateCart);

// Clear the cart
router.delete("/", userAuth, clearCart);

export { router as cartRouter };
