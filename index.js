import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { apiRouter } from './routes/index.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",                     // React dev server (Create React App)
    "http://localhost:5173",                     // React dev server (Vite)
    "https://newfoodorderweb-7.onrender.com",    // Deployed backend
    "https://food-order-web-app-frontend2.vercel.app" // Deployed frontend
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));

app.use(express.json());        // Parse incoming JSON
app.use(cookieParser());        // Parse cookies
app.use(morgan('dev'));         // HTTP request logging

// Route prefix for API
app.use('/api', apiRouter);

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 404 Handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
