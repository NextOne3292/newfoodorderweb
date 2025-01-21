import { Order } from '../models/orderModel.js';

// Create an order (Protected route)
export const createOrder = async (req, res) => {
  const { userId, items, totalPrice, deliveryAddress, estimatedDeliveryTime } = req.body;

  try {
    const order = new Order({
      userId,
      items,
      totalPrice,
      deliveryAddress,
      estimatedDeliveryTime,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Get all orders (Admin only)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId items.menuItemId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get a specific order by ID (Protected route)
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId items.menuItemId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status || order.status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};

// Delete an order (Admin only)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};
