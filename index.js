import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors'; // Import CORS
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js'; // Import the database connection function
import { apiRouter } from './routes/index.js';


dotenv.config(); // Load environment variables from the .env file

// Create an instance of Express
const app = express();

// Middleware
app.use(cors({ 
    origin: 'http://localhost:5175',  // Allow frontend to access backend
    credentials: true // Allow cookies & authentication headers
}));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(morgan('dev'));  // Middleware for logging HTTP requests in development mode

// Connect to the database
connectDB();

// Use API routes
app.use('/api', apiRouter); // All routes will be prefixed with /api

// Define a basic route to test the server
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Define the port from environment variables or default to 5000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

