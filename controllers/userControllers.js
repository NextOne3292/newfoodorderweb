import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utilities/token.js";
export const userSignup = async (req, res, next) => {
    try {
        console.log("hitted");

        const { name, email, password, mobile } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            return res.status(400).json({ message: "user already exist" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const userData = new User({ name, email, password: hashedPassword, mobile });
        await userData.save();

        const token = generateToken(userData._id);
        res.cookie("token", token);

        return res.json({ data: userData, message: "user account created" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const userlogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(404).json({ message: "user does not exist" });
        }

        const passwordMatch = bcrypt.compareSync(password, userExist.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "user not authenticated" });
        }
        const token = generateToken(userExist._id);
        res.cookie("token", token, { httpOnly: true });

        // Respond with the user data and success message
        return res.json({
            data: {
                id: userExist._id,
                name: userExist.name,
                email: userExist.email,
                mobile: userExist.mobile
            
            },
            message: "User login success",
        });
        
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const userProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const userData = await User.findById(userId).select("-password");
        return res.json({ data: userData, message: "user profile fetched" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
export const updateUser = async (req, res, next) => {
    try {
        const userId = req.user.id; // Extract user ID from `userAuth` middleware
        const { name, email, mobile} = req.body;

        if (!name && !email && !mobile ) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const updatedData = { name, email, mobile };

        // Remove undefined fields
        Object.keys(updatedData).forEach(key => {
            if (!updatedData[key]) delete updatedData[key];
        });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updatedData },
            { new: true, runValidators: true } // Return updated document and validate changes
        ).select("-password");

        return res.json({ data: updatedUser, message: "User updated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const userLogout = async (req, res, next) => {
    try {
        res.clearCookie("token");

        return res.json({ message: "user logout success" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
export const checkUser = async (req, res, next) => {
    try {
        const { email, mobile } = req.query;

        if (!email && !mobile) {
            return res.status(400).json({ message: "Provide email or mobile to check user" });
        }

        const user = await User.findOne({
            $or: [{ email }, { mobile }],
        }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        return res.json({ data: user, message: "User exists" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
