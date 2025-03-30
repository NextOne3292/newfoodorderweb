import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true, // Adding an index for faster search
    },
    address: {
      type: String,
      required: true, // Address is mandatory
    },
    contact: {
      type: String,
      required: true, // Contact info is mandatory (e.g., phone or email)
    },
    cuisines: {
      type: [String], // Array to store multiple cuisines
      default: ['Other'],
    },
    image: {
      type: String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaLGtEd0MJro4X9wDmT2vrvLT-HjKkyyWVmg&s",
    },
    menu: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu', // Reference to the Menu model
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5, // Ensures the rating stays between 0 and 5
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
