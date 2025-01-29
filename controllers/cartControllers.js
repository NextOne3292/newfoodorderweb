import mongoose from "mongoose";
import { Cart } from "../models/cartModel.js";

// Add an item to the cart
export const addToCart = async (req, res) => {
  const { menuItem, quantity = 1, price } = req.body;

  if (!mongoose.Types.ObjectId.isValid(menuItem) || quantity <= 0 || price <= 0) {
    return res.status(400).json({ success: false, message: "Invalid input data" });
  }

  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      const newCart = new Cart({
        user: req.user.id,
        items: [{ menuItem, quantity, price }],
      });
      await newCart.save();
      return res.status(201).json({ success: true, cart: newCart });
    }

    const existingItem = cart.items.find(item => item.menuItem.toString() === menuItem);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = price; // Update price if provided
    } else {
      cart.items.push({ menuItem, quantity, price });
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding item to cart", error });
  }
};

// Get the user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.menuItem");

    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [] } });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching cart", error });
  }
};

// Update the quantity of a cart item
export const updateCart = async (req, res) => {
  const { menuItemId } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(menuItemId) || quantity <= 0) {
    return res.status(400).json({ success: false, message: "Invalid input data" });
  }

  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.menuItem.toString() === menuItemId);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating cart", error });
  }
};

// Clear the cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(200).json({ success: true, message: "Cart is already empty" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error clearing cart", error });
  }
};
