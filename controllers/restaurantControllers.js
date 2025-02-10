import { Restaurant } from "../models/restaurantModel.js"; 
import { cloudinary } from "../config/cloudinaryConfig.js";


// Get all restaurants
export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().populate("menu");
        res.status(200).json({ success: true, data: restaurants });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single restaurant by ID
export const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id).populate("menu");

        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new restaurant
export const createRestaurant = async (req, res) => {
    try {
        const { name, address, contact, cuisine } = req.body;
        let imageUrl = "";

        // Check if file is uploaded
        if (req.file) {
            imageUrl = req.file.path; // Get uploaded image URL from Cloudinary
        }

        const newRestaurant = new Restaurant({
            name,
            address,
            contact,
            cuisine,
            image: imageUrl
        });

        await newRestaurant.save();

        res.status(201).json({ success: true, data: newRestaurant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a restaurant
export const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Upload new image to Cloudinary if provided
        if (req.file) {
            updates.image = req.file.path; // Update image URL
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedRestaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        res.status(200).json({ success: true, data: updatedRestaurant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a restaurant
export const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

        if (!deletedRestaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        res.status(200).json({ success: true, message: "Restaurant deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
