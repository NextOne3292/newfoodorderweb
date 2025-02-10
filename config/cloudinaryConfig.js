import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Set up Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // Change folder name if needed
    format: async (req, file) => "jpeg", // Supports jpg, png, jpeg
    public_id: (req, file) => file.originalname, // Keep original file name
  },
});

// ✅ Configure Multer Middleware
const upload = multer({ storage });

export { cloudinary, upload };
