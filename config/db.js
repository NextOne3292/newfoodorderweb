// db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from the .env file

// Optional: Handle strict query mode to manage potential deprecation warnings
mongoose.set('strictQuery', true);

// Function to connect to the database
export const connectDB = async () => {
    try {
        // Connect to MongoDB using the URI stored in environment variables
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,        // Use the new URL string parser
            useUnifiedTopology: true,     // Use the unified topology engine
            ssl: true,                    // Ensure SSL is enabled for MongoDB Atlas
            tlsAllowInvalidCertificates: true,  // Use with caution: allows invalid certs (if self-signed)
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);  // Exit the process if connection fails
    }
};
