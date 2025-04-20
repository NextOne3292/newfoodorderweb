import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: String,
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: "India"
    }
}, { timestamps: true });

export const Address = mongoose.model("Address", addressSchema);
