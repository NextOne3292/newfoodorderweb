import { admin } from "../models/adminModel.js";
import { User } from "../models/userModel.js";

import bcrypt from "bcrypt";
import { generateToken } from "../utilities/token.js";

export const adminSignUp = async (req, res, next) => {
  try {
      console.log("hitted");

      const { name, email, password, mobile } = req.body;

      if (!name || !email || !password || !mobile) {
          return res.status(400).json({ message: "all fields are required" });
      }

      const isAdminExist = await admin.findOne({ email });

      if (isAdminExist) {
          return res.status(400).json({ message: "admin already exist" });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const adminData = new admin({ name, email, password: hashedPassword, mobile });
      await adminData.save();

      const token = generateToken(adminData._id);
      res.cookie("token", token);

      return res.json({ data: adminData, message: "admin account created" });
  } catch (error) {
      return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const adminLogin = async (req, res, next) => {
  try {
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).json({ message: "All fields are required" });
      }

      // Find the admin using the admin model
      const adminExist = await admin.findOne({ email });

      if (!adminExist) {
          return res.status(404).json({ message: "Admin does not exist" });
      }

      // Compare the provided password with the hashed password
      const passwordMatch = bcrypt.compareSync(password, adminExist.password);

      if (!passwordMatch) {
          return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate a token with admin role
      const token = generateToken(adminExist._id, "admin");

      // Set the token in the cookie
      res.cookie("token", token, { httpOnly: true });

      // Respond with admin details (excluding password)
      return res.json({
          data: {
              id: adminExist._id,
              name: adminExist.name,
              email: adminExist.email,
              mobile: adminExist.mobile,
              
          },
          message: "Admin login successful",
      });
  } catch (error) {
      return res
          .status(error.statusCode || 500)
          .json({ message: error.message || "Internal server error" });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
      console.log("Fetching all users...");

      const users = await User.find().select("-password"); // Exclude password field
      console.log("Users fetched:", users);

      res.status(200).json(users);
  } catch (error) {
      console.error("Error fetching users:", error); // Log the error
      res.status(500).json({ message: "Error fetching users", error });
  }
};


// Update user role (e.g., promote to admin)
export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;

  try {
      const user = await User.findByIdAndUpdate(
          userId,
          { role },
          { new: true, runValidators: true }
      );

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User role updated', user });
  } catch (error) {
      res.status(500).json({ message: 'Error updating user role', error });
  }
};
export const adminLogout = async (req, res, next) => {
  try {
      res.clearCookie("token");

      return res.json({ message: "admin logout success" });
  } catch (error) {
      return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  };
  