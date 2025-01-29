import { Menu } from "../models/menuModel.js";
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";

// Get all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find().populate("restaurant");
    res.status(200).json({ success: true, data: menuItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single menu item by ID
export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id).populate("restaurant");

    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    res.status(200).json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new menu item
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, restaurant } = req.body;

    // Upload image to Cloudinary if provided
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinaryInstance.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const newMenuItem = await Menu.create({
      name,
      description,
      price,
      restaurant,
      ...(imageUrl && { imageUrl }),
    });

    res.status(201).json({ success: true, data: newMenuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Upload new image to Cloudinary if provided
    if (req.file) {
      const result = await cloudinaryInstance.uploader.upload(req.file.path);
      updates.imageUrl = result.secure_url;
    }

    const updatedMenuItem = await Menu.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedMenuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    res.status(200).json({ success: true, data: updatedMenuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMenuItem = await Menu.findByIdAndDelete(id);

    if (!deletedMenuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    res.status(200).json({ success: true, message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
