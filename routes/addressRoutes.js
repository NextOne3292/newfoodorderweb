import express from "express";
import {
    addAddress,
    getUserAddresses,
    updateAddress,deleteAddress
} from "../controllers/addressControllers.js";
import { userAuth } from '../middlewares/userAuth.js';

const router = express.Router();

router.post("/add", userAuth, addAddress);
router.get("/", userAuth, getUserAddresses);
router.put("/update/:id", userAuth, updateAddress);
router.delete("/delete/:id", userAuth, deleteAddress);


export { router as addressRouter };
