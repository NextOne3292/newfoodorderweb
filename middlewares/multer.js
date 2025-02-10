import multer from "multer";
import { storage } from "../config/cloudinaryConfig.js"; // Import Cloudinary storage

export const upload = multer({ storage });
