import { Address } from "../models/addressModel.js";
import asyncHandler from "express-async-handler";


export const addAddress = async (req, res) => {
    try {
        const { addressLine1, addressLine2, city, state, postalCode, country } = req.body;

        const address = new Address({
            user: req.user.id,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode, 
            country
        });

        await address.save();

        res.status(201).json({ message: "Address added successfully", address });
    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to add address" });
    }
};

export const getUserAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user.id });
        res.status(200).json({ addresses });
    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to fetch addresses" });
    }
};
export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { addressLine1, addressLine2, city, state, postalCode, country } = req.body;

        const address = await Address.findOneAndUpdate(
            { _id: id, user: req.user.id },
            {
                addressLine1,
                addressLine2,
                city,
                state,
                postalCode,
                country
            },
            { new: true }
        );

        if (!address) {
            return res.status(404).json({ message: "Address not found or unauthorized" });
        }

        res.status(200).json({ message: "Address updated successfully", address });
    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to update address" });
    }
};
// addressController.js
export const deleteAddress = asyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);

    if (!address) {
        res.status(404);
        throw new Error("Address not found");
    }

    // Optional: ensure user is authorized
    if (address.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error("Not authorized to delete this address");
    }

    await Address.deleteOne({ _id: address._id });

    res.json({ message: "Address deleted successfully" });
});
