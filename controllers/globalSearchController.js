// controllers/globalSearch.js
import {Restaurant} from "../models/restaurantModel.js";
import {Menu} from "../models/menuModel.js";
import {Order} from "../models/orderModel.js";
import {User} from "../models/userModel.js";

export const globalSearch = async (req, res) => {
  const query = req.query.query;

  try {
    const [restaurants, menus, orders, users] = await Promise.all([
      Restaurant.find({ name: { $regex: query, $options: "i" } }),
      Menu.find({ name: { $regex: query, $options: "i" } }),
      Order.find({ orderId: { $regex: query, $options: "i" } }),
      User.find({
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      }),
    ]);

    res.json({
      restaurants,
      menus,
      orders,
      users,
    });
  } catch (err) {
    res.status(500).json({ error: "Search failed", details: err.message });
  }
};
