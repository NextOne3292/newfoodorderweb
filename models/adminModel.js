import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 30,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    mobile: {
        type: String,
        required: true,
    },
   
    },
    {timestamps: true }
);

export const admin = mongoose.model("admin", adminSchema);