import { Menu } from '../models/menuModel.js';

// Create a menu item
export const createMenuItem = async (req, res) => {
  const { restaurantId, itemName, description, price, imageUrl, category, isAvailable } = req.body;

  try {
    const menuItem = new Menu({
      restaurantId,
      itemName,
      description,
      price,
      imageUrl,
      category,
      isAvailable,
    });
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu item', error: error.message });
  }
};

// Get all menu items for a specific restaurant
export const getMenuItemsByRestaurant = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const menuItems = await Menu.find({ restaurantId });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
};

// Get a single menu item by ID
export const getMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu item', error: error.message });
  }
};

// Update a menu item
export const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { itemName, description, price, imageUrl, category, isAvailable } = req.body;

  try {
    const menuItem = await Menu.findByIdAndUpdate(
      id,
      { itemName, description, price, imageUrl, category, isAvailable },
      { new: true }
    );
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item', error: error.message });
  }
};

// Delete a menu item
export const deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await Menu.findByIdAndDelete(id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  }
};
