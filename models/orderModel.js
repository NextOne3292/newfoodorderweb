import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  deliveryAddress: {
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: "Pending", // Could be: "Pending", "Paid", "Failed", etc.
  },
  paymentMethod: String,
  stripeSessionId: String,
  orderStatus: {
    type: String,
    enum: ["Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Placed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("Order", orderSchema);
