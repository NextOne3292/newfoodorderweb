import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: [1, 'Discount must be at least 1%'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    expirationDate: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number,
      default: 0, // 0 means unlimited usage
    },
    timesUsed: {
      type: Number,
      default: 0,
    },
    minimumOrderAmount: {
      type: Number,
      default: 0,
    },
    applicableCategories: [
      {
        type: String,
        enum: ['starter', 'main', 'dessert', 'drink'],
      },
    ],
    applicableRestaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
      },
    ],
    appliesToNewUsersOnly: {
      type: Boolean,
      default: false,
    },
    discountCapAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model('Coupon', couponSchema);
