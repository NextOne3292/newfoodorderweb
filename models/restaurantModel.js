import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  contactInfo: {
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  cuisineType: {
    type: String,
    enum: ['Italian', 'Chinese', 'Indian', 'Mexican', 'American', 'Other'],
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  menu: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
    },
  ],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  openingHours: {
    type: String,
    required: true, // e.g., "9:00 AM - 9:00 PM"
  },
  imageUrl: {  // New image field for restaurant's logo/banner
    type: String,
    default: 'https://example.com/restaurant-placeholder-image.png', // Placeholder image URL
  },
}, { timestamps: true });

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
