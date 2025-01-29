import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Restaurant name is mandatory
    },
    address: {
      type: String,
      required: true, // Address is mandatory
    },
    contact: {
      type: String,
      required: true, // Contact info is mandatory (e.g., phone or email)
    },
    cuisine: {
      type: String,
      default: 'Other', // Default to 'Other' if no specific cuisine is provided
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
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
