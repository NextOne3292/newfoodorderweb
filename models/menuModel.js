import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Menu item name is mandatory
      index: true,
    },
    description: {
      type: String, // Short description of the menu item
    },
    price: {
      type: Number,
      required: true, // Price is mandatory
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant", // Reference to the Restaurant model
      required: true,
    },
    image: {
      type: String,
      default: "https://example.com/food-placeholder-image.png", // Default placeholder image
    },
    isAvailable: {
      type: Boolean,
      default: true, // Default availability is true
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

export const Menu = mongoose.model("Menu", menuSchema);
