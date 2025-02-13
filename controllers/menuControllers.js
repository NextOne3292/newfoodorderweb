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


export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, restaurant } = req.body;

    if (!name || !description || !price || !restaurant) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let imageUrl = "https://example.com/food-placeholder-image.png"; // Default image

    // ✅ Check if an image file is received
    if (req.file) {
      console.log("File received:", req.file); // Debugging

      try {
        // ✅ Upload to Cloudinary
        const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path, {
          folder: "menu_items", // Store in a specific folder
          use_filename: true, // Use the original filename
        });
        console.log("Cloudinary Upload Result:", cloudinaryResponse);
        imageUrl = cloudinaryResponse.secure_url; // Update image URL
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.status(500).json({ success: false, message: "Image upload failed" });
      }
    } else {
      console.log("No file received! Using default image.");
    }

    // ✅ Convert price to a proper number
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
      imageUrl, // Use the updated image URL
    });

    res.status(201).json({
      success: true,
      data: {
        ...newMenuItem._doc,
        price: `₹${numericPrice.toFixed(2)}` // Format price in response
      },
      message: "Menu item created successfully"
    });

  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = { ...req.body };

    // ✅ Upload new image to Cloudinary if provided
    if (req.file) {
      const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
      console.log("Cloudinary Upload Result:", cloudinaryResponse);
      updates.imageUrl = cloudinaryResponse.secure_url;
    }

    // ✅ Convert price to a number
    if (updates.price) {
      updates.price = parseFloat(updates.price);
      if (isNaN(updates.price)) {
        return res.status(400).json({ success: false, message: "Invalid price format" });
      }
    }

    const updatedMenuItem = await Menu.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedMenuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    // ✅ Format the price with currency symbol before sending response
    const formattedMenuItem = {
      ...updatedMenuItem._doc,
      price: `₹${updatedMenuItem.price.toFixed(2)}`, // Adds ₹ symbol
    };

    res.status(200).json({ success: true, data: formattedMenuItem, message: "Menu item updated successfully" });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
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
