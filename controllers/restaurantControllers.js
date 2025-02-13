import { Restaurant } from "../models/restaurantModel.js"; 
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";


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
export const createRestaurant = async (req, res, next) => {
    try {
        const { name, address, contact, cuisine } = req.body;

        if (!name || !address || !contact || !cuisine) {
            return res.status(400).json({ message: "All fields are required" });
        }

         // ✅ Define cloudinaryResponse with a default value to avoid ReferenceError
         let cloudinaryResponse = { url: "" };

        // Upload image if provided
        if (req.file) {
            cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
        }

        console.log("cldRes====", cloudinaryResponse);

        // ✅ Use the correct model (Restaurant, not Course)
        const restaurantData = new Restaurant({
            name,
            address,
            contact,
            cuisine,
            image: cloudinaryResponse.url, // Ensuring it always has a value
            
        });

        await restaurantData.save();

        res.status(201).json({ data: restaurantData, message: "Restaurant created successfully" });
    } catch (error) {
        console.error("Error creating restaurant:", error);
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

// Update a restaurant
export const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = { ...req.body };

        // Upload new image to Cloudinary if provided
        if (req.file) {
            const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
            updates.image = cloudinaryResponse.url; // Store Cloudinary URL
        }

        console.log("Cloudinary Upload Result:", updates.image);

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true, // Ensures schema validation
        });

        if (!updatedRestaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        res.status(200).json({ success: true, data: updatedRestaurant, message: "Restaurant updated successfully" });
    } catch (error) {
        console.error("Error updating restaurant:", error);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
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
