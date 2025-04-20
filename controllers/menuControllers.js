import { Menu } from "../models/menuModel.js";
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";

export const getAllMenuItems = async (req, res) => {
  try {
      const { search, restaurant } = req.query; // Get search keyword & restaurant ID from query params

      let filter = {};
      if (restaurant) {
          filter.restaurant = restaurant; // Filter menu items by restaurant ID
      }
      if (search) {
          filter.name = { $regex: search, $options: "i" }; // Case-insensitive search for menu item name
      }

      const menuItems = await Menu.find(filter).populate("restaurant","name"); // Apply filters
      res.status(200).json({ success: true, data: menuItems });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single menu item by ID
export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id).populate("restaurant", "name");

    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    res.status(200).json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, restaurant } = req.body;

    // ✅ Convert isAvailable to a boolean
    let isAvailable = req.body.isAvailable === "true"; // Ensures it's a boolean

    // ✅ Proper validation check
    if (!name || !description || !price || !restaurant || isAvailable === undefined) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let image = "https://example.com/food-placeholder-image.png"; // Default image

    // ✅ Check if an image file is received
    if (req.file) {
      console.log("File received:", req.file);
      try {
        // ✅ Upload to Cloudinary
        const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path, {
          folder: "menu_items",
          use_filename: true,
        });

        console.log("Cloudinary Upload Result:", cloudinaryResponse);
        image = cloudinaryResponse.secure_url; // Update image URL
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.status(500).json({ success: false, message: "Image upload failed" });
      }
    } else {
      console.log("No file received! Using default image.");
    }

    // ✅ Convert price to a number
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ success: false, message: "Invalid price format. Price must be a positive number." });
    }

    // ✅ Create a new menu item
    const newMenuItem = await Menu.create({
      name,
      description,
      price: numericPrice,
      restaurant,
      image,
      isAvailable, // ✅ Now it's correctly defined
    });

    res.status(201).json({
      success: true,
      data: {
        ...newMenuItem._doc,
        price: `₹${numericPrice.toFixed(2)}`,
      },
      message: "Menu item created successfully",
    });

  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const existingMenuItem = await Menu.findById(id);

    if (!existingMenuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    const { name, description, price, restaurant } = req.body;
    const isAvailable = req.body.isAvailable === "true";

    let updatedFields = {
      name,
      description,
      price,
      restaurant,
      isAvailable,
    };

    // ✅ Handle image update only if a new image is uploaded
    if (req.file) {
      // Upload new image to Cloudinary
      const result = await cloudinaryInstance.uploader.upload(req.file.path, {
        folder: "food-menu",
      });
      updatedFields.image = result.secure_url;
    } else {
      // ✅ Keep existing image if no new one is uploaded
      updatedFields.image = existingMenuItem.image;
    }

    const updatedItem = await Menu.findByIdAndUpdate(id, updatedFields, { new: true }).populate("restaurant","name");

    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    console.error("Update Error:", error);
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
// Delete all menu items
export const deleteAllMenuItems = async (req, res) => {
  try {
    const result = await Menu.deleteMany({}); // Deletes all documents from the Menu collection

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "No menu items found to delete" });
    }

    res.status(200).json({ success: true, message: "All menu items deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


