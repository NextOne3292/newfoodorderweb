import { Restaurant } from "../models/restaurantModel.js";
import { Menu } from "../models/menuModel.js";

export const getSearchResults = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        let restaurants = [];
        let menus = [];

        if (query.toLowerCase() === "restaurants") {
            // Fetch all restaurants
            restaurants = await Restaurant.find();
        } else if (query.toLowerCase() === "menuitems") {
            // Fetch all menu items with restaurant details populated
            menus = await Menu.find().populate("restaurant", "name description address contact cuisines rating image");
        } else {
            // Search for restaurants by name or cuisine type
            restaurants = await Restaurant.find({
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { cuisines: { $regex: query, $options: "i" } }
                ]
            });

            // Search for menu items by name or description
            menus = await Menu.find({
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } }
                ]
            }).populate("restaurant", "name description address contact cuisines rating image price");
        }

        res.json({ restaurants, menus });
    } catch (error) {
        console.error("Error searching:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
