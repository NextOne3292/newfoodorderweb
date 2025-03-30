import { Restaurant } from "../models/restaurantModel.js";
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";

// Get all restaurants
export const getAllRestaurants = async (req, res) => {
    try {
        const { search } = req.query; // Get search keyword from query params

        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { name: { $regex: search, $options: "i" } }, // Case-insensitive name search
                    { cuisines: { $regex: search, $options: "i" } }, // Search by cuisine type
                ],
            };
        }

        const restaurants = await Restaurant.find(filter).populate("menu");
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
        const { name, address, contact, cuisines, menu, rating } = req.body;

        if (!name || !address || !contact) {
            return res.status(400).json({ message: "Name, address, and contact are required" });
        }

        let imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaLGtEd0MJro4X9wDmT2vrvLT-HjKkyyWVmg&s";

        // Upload image if provided
        if (req.file) {
            const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
            imageUrl = cloudinaryResponse.url;
        }

        const restaurantData = new Restaurant({
            name,
            address,
            contact,
            cuisines: Array.isArray(cuisines) ? cuisines : JSON.parse(cuisines || '["Other"]'),

            image: imageUrl,
            menu: menu || [],
            rating: rating || 0,
        });

        await restaurantData.save();

        res.status(201).json({ data: restaurantData, message: "Restaurant created successfully" });
    } catch (error) {
        console.error("Error creating restaurant:", error);
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

// Update a restaurant
// Update a restaurant
export const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = { ...req.body };

        // Upload new image to Cloudinary if provided
        if (req.file) {
            const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
            updates.image = cloudinaryResponse.url;
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).populate("menu"); // ✅ Populate the menu field

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
// 🚀 Delete all restaurants (Admin Only)
export const deleteAllRestaurants = async (req, res) => {
    try {
        const result = await Restaurant.deleteMany();

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "No restaurants found to delete" });
        }

        res.status(200).json({ success: true, message: `${result.deletedCount} restaurants deleted successfully` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


