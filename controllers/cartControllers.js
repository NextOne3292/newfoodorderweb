import { Cart } from '../models/cartModel.js';

// Add an item to the cart
export const addToCart = async (req, res) => {
  const { menuItemId, quantity, price } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      const newCart = new Cart({
        userId: req.user.id,
        items: [{ menuItemId, quantity, price }],
        totalPrice: quantity * price,
      });
      await newCart.save();
      return res.status(201).json(newCart);
    }

    const existingItem = cart.items.find(item => item.menuItemId.toString() === menuItemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ menuItemId, quantity, price });
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + (item.quantity * item.price), 0);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart', error });
  }
};

// Get cart items for a user
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.menuItemId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

// Update cart item quantity
export const updateCart = async (req, res) => {
  const { menuItemId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.menuItemId.toString() === menuItemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;

    cart.totalPrice = cart.items.reduce((total, item) => total + (item.quantity * item.price), 0);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error });
  }
};

// Clear the cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error });
  }
};
