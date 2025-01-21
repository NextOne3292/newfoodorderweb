import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you're using ObjectId for restaurants
    required: true,
    ref: 'Restaurant' // Reference to the Restaurant model
  },
  itemName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    default: 'https://example.com/placeholder-image.png' // Placeholder image URL
  },
  category: {
    type: String,
    enum: ['starter', 'main', 'dessert', 'drink'],
  }, isAvailable: {
    type: Boolean,
    default: true, // Indicates whether the menu item is available for ordering
  },
}, { timestamps: true });

export const Menu = mongoose.model('Menu', menuSchema);
