import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price: {
        type: Number,
        required: true, // Store the price at the time of adding to the cart
      },
    },
  ],
  totalPrice: {
    type: Number,
    default: 0, // The total cost of items in the cart
  },
  status: {
    type: String,
    enum: ['active', 'converted', 'cancelled'], // Status of the cart
    default: 'active',
  },
  couponCode: {
    type: String, // Optional reference to a coupon code, if applied
  },
  estimatedTotal: {
    type: Number, // Total after discounts
    default: 0,
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'pending'], // Payment status
    default: 'unpaid',
  },
  deliveryAddress: {
    type: String, // Delivery address
  },
}, { timestamps: true });

export const Cart = mongoose.model('Cart', cartSchema);
