import { Order } from "../models/orderModel.js";
import { Cart } from "../models/cartModel.js";

// 🧾 Create Order After Payment Success
export const createOrder = async (req, res) => {
  try {
    const { sessionId, cartId, deliveryAddress } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const order = new Order({
      user: req.user.id,
      items: cart.items.map(item => ({
        menuItem: item.menuItem,
        quantity: item.quantity,
      })),
      deliveryAddress,
      totalAmount: cart.totalPrice,
      paymentStatus: "Paid",
      paymentMethod: "Card",
      stripeSessionId: sessionId,
    });

    await order.save();

    // ✅ Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    cart.markModified("items");
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};

// 🧾 Get Orders for Logged-in User
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.menuItem", "name price image");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
  }
};

// 🧾 Admin - Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.menuItem", "name price image");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch all orders", error: error.message });
  }
};
// 🧾 Admin - Update Order Status
// 🧾 Admin - Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid order status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
