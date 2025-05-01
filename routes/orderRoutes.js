import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
   // 👈 new controller for admin
   deleteOrderItem,
} from "../controllers/orderControllers.js";

import { userAuth } from "../middlewares/userAuth.js";
import { adminAuth } from "../middlewares/adminAuth.js"; // 👈 make sure this exists

const router = express.Router();

// User routes
router.post("/", userAuth, createOrder);
router.get("/", userAuth, getMyOrders);

// Admin route
router.get("/all", userAuth, adminAuth, getAllOrders); // 👈 only admin can access this
router.put("/:orderId/status", userAuth, adminAuth, updateOrderStatus); 
router.delete("/:orderId/item/:itemId", userAuth, deleteOrderItem);

export { router as orderRouter };
