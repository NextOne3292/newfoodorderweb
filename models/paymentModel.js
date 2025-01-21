import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['credit card', 'paypal', 'cash'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  amount: {
    type: Number,
    required: true, // Payment amount is required
  },
  transactionId: {
    type: String, // Unique identifier for the payment transaction
    unique: true, // Ensures no duplicate transaction IDs
  },
  attemptTimestamp: {
    type: Date,
    default: Date.now, // Timestamp for when the payment attempt is made
  },
}, { timestamps: true }); // Timestamps include createdAt and updatedAt fields by default

export const Payment = mongoose.model('Payment', paymentSchema);
