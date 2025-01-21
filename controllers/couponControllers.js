import { Coupon } from '../models/couponModel.js';

// Create a coupon
export const createCoupon = async (req, res) => {
  const {
    code,
    discountPercentage,
    expirationDate,
    usageLimit,
    minimumOrderAmount,
    applicableCategories,
    applicableRestaurants,
    appliesToNewUsersOnly,
    discountCapAmount,
  } = req.body;

  try {
    const coupon = new Coupon({
      code,
      discountPercentage,
      expirationDate,
      usageLimit,
      minimumOrderAmount,
      applicableCategories,
      applicableRestaurants,
      appliesToNewUsersOnly,
      discountCapAmount,
    });

    await coupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (error) {
    res.status(500).json({ message: 'Error creating coupon', error: error.message });
  }
};

// Get all coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coupons', error: error.message });
  }
};

// Apply a coupon
export const applyCoupon = async (req, res) => {
  const { code, orderTotal, userId, isNewUser } = req.body;

  try {
    const coupon = await Coupon.findOne({ code });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ message: 'Coupon not found or inactive' });
    }

    if (new Date(coupon.expirationDate) < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (coupon.usageLimit > 0 && coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    if (coupon.minimumOrderAmount > orderTotal) {
      return res.status(400).json({ message: `Order total must be at least ${coupon.minimumOrderAmount}` });
    }

    if (coupon.appliesToNewUsersOnly && !isNewUser) {
      return res.status(400).json({ message: 'Coupon is only valid for new users' });
    }

    const discountAmount = Math.min(
      (coupon.discountPercentage / 100) * orderTotal,
      coupon.discountCapAmount || Infinity
    );

    res.status(200).json({
      message: 'Coupon applied successfully',
      discountAmount,
      discountPercentage: coupon.discountPercentage,
    });

    coupon.timesUsed += 1;
    await coupon.save();
  } catch (error) {
    res.status(500).json({ message: 'Error applying coupon', error: error.message });
  }
};

// Delete a coupon
export const deleteCoupon = async (req, res) => {
  const { id } = req.params;

  try {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting coupon', error: error.message });
  }
};
