
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
import { Restaurant } from "../models/restaurantModel.js";
import { Menu } from "../models/menuModel.js";

// Create a new restaurant
export const createRestaurant = async (req, res) => {
  try {
    const { name, address, contact, cuisines, rating, menu } = req.body;

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinaryInstance.uploader.upload(req.file.path, {
        folder: "restaurants",
      });
      imageUrl = result.secure_url;
    }

    // Parse cuisines
    const cuisinesArray = typeof cuisines === "string"
      ? cuisines.split(",").map((c) => c.trim())
      : cuisines;

    // Parse menu IDs
    let menuArray = [];
    if (menu) {
      const parsedMenu = typeof menu === "string" ? JSON.parse(menu) : menu;
      menuArray = parsedMenu.map((item) => item._id || item);
    }

    const restaurant = await Restaurant.create({
      name,
      address,
      contact,
      cuisines: cuisinesArray,
      rating,
      image: imageUrl,
      menu: menuArray,
    });

    res.status(201).json({ success: true, data: restaurant });
  } catch (err) {
    console.error("Error creating restaurant:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get a single restaurant by ID along with its menu
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    const menuItems = await Menu.find({ restaurant: restaurant._id });

    res.status(200).json({
      success: true,
      data: {
        ...restaurant.toObject(),
        menu: menuItems,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate("menu");
    res.status(200).json({ success: true, data: restaurants });
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update restaurant
export const updateRestaurant = async (req, res) => {
  try {
    const { name, address, contact, cuisines, rating, menu } = req.body;

    // Upload new image if provided
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinaryInstance.uploader.upload(req.file.path, {
        folder: "restaurants",
      });
      imageUrl = result.secure_url;
    }

    const cuisinesArray = typeof cuisines === "string"
      ? cuisines.split(",").map((c) => c.trim())
      : cuisines;

    let menuArray = [];
    if (menu) {
      const parsedMenu = typeof menu === "string" ? JSON.parse(menu) : menu;
      menuArray = parsedMenu.map((item) => item._id || item);
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      {
        name,
        address,
        contact,
        cuisines: cuisinesArray,
        rating,
        ...(imageUrl && { image: imageUrl }),
        menu: menuArray,
      },
      { new: true }
    ).populate("menu");

    res.status(200).json({ success: true, data: updatedRestaurant });
  } catch (err) {
    console.error("Error updating restaurant:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a single restaurant
export const deleteRestaurant = async (req, res) => {
  try {
    const deleted = await Restaurant.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    res.status(200).json({ success: true, message: "Restaurant deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete all restaurants
export const deleteAllRestaurants = async (req, res) => {
  try {
    const result = await Restaurant.deleteMany();

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "No restaurants to delete" });
    }

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} restaurants deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
