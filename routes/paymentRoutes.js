import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { userAuth } from "../middlewares/userAuth.js";
import { Menu } from "../models/menuModel.js";
import { Order } from "../models/orderModel.js";
import { Cart } from "../models/cartModel.js";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.Stripe_private_Api_Key);
const client_domain = process.env.CLIENT_DOMAIN;

router.post("/create-checkout-session", userAuth, async (req, res) => {
  try {
    const { items, deliveryAddress, cartId } = req.body;

    console.log("📦 cartId received from frontend:", cartId);

    const lineItems = await Promise.all(
      items.map(async (item) => {
        const menuItem = await Menu.findById(item.menuItem);
        if (!menuItem) throw new Error(`Menu item not found: ${item.menuItem}`);

        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: menuItem.name,
              images: [menuItem.image],
            },
            unit_amount: Math.round(menuItem.price * 100),
          },
          quantity: item.quantity,
        };
      })
    );

    const metadata = {
      userId: req.user.id,
      deliveryAddress: JSON.stringify(deliveryAddress),
      items: JSON.stringify(items),
    };
    if (cartId) metadata.cartId = cartId;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${client_domain}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${client_domain}/cancel`,
      metadata,
    });

    res.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ success: false, message: "Failed to create Stripe checkout session" });
  }
});

router.get("/verify-payment", async (req, res) => {
  try {
    const sessionId = req.query.session_id;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Missing session_id" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || !session.metadata) {
      return res.status(400).json({ success: false, message: "Invalid session or missing metadata" });
    }

    const { userId, deliveryAddress, items, cartId } = session.metadata;

    console.log("----- VERIFY PAYMENT DEBUG -----");
    console.log("Session ID:", sessionId);
    console.log("User ID:", userId);
    console.log("Cart ID:", cartId, typeof cartId);
    console.log("Delivery Address:", deliveryAddress);
    console.log("Items:", items);
    console.log("--------------------------------");

    const order = await Order.create({
      user: userId,
      items: JSON.parse(items),
      deliveryAddress: JSON.parse(deliveryAddress),
      totalAmount: session.amount_total / 100,
      paymentStatus: session.payment_status,
      paymentMethod: session.payment_method_types[0],
      stripeSessionId: session.id,
    });

    if (cartId && cartId !== "undefined" && mongoose.Types.ObjectId.isValid(cartId)) {
      const deletedCart = await Cart.findByIdAndDelete(cartId);
      if (!deletedCart) {
        console.warn(`⚠️ Cart with ID ${cartId} not found or already deleted.`);
      } else {
        console.log(`🗑️ Cart deleted successfully: ${cartId}`);
      }
    } else {
      console.warn("⚠️ Invalid or missing cartId. Cannot delete cart.");
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
});

export { router as paymentRouter };
