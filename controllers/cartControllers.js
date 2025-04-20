import mongoose from "mongoose";
import { Cart } from "../models/cartModel.js";
import { Menu } from "../models/menuModel.js";

// 🛒 Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { menuItem, quantity } = req.body;
    const userId = req.user.id;

    const menuItemDetails = await Menu.findById(menuItem).select("price");
    if (!menuItemDetails) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find(
      (item) => item.menuItem.toString() === menuItem
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        menuItem,
        quantity,
        price: menuItemDetails.price,
      });
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding item to cart", error });
  }
};

// 🛒 Get Cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.menuItem", "name image price");

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ success: true, message: "Your cart is empty", cart: { items: [], totalPrice: 0 } });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching cart", error });
  }
};

// 🛒 Update Cart Item Quantity
export const updateCart = async (req, res) => {
  const { menuItemId } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(menuItemId) || quantity <= 0) {
    return res.status(400).json({ success: false, message: "Invalid input data" });
  }

  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.items.find(item => item.menuItem.toString() === menuItemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found in cart" });

    item.quantity = quantity;
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    await cart.save();

    // ✅ Populate menuItem before sending response
    const updatedCart = await Cart.findById(cart._id).populate("items.menuItem");

    res.status(200).json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating cart", error });
  }
};

// 🛒 Remove Item from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(item => item.menuItem.toString() !== menuItemId);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing item", error });
  }
};

// 🛒 Clear Cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(200).json({ success: true, message: "Cart is already empty" });

    cart.items = [];
    cart.totalPrice = 0;
    cart.markModified("items"); // Ensure Mongoose detects change
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error clearing cart", error });
  }
};
