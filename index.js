import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { apiRouter } from './routes/index.js';

dotenv.config(); // Load env variables

const app = express();

// ✅ Convert the comma-separated CLIENT_DOMAIN string into an array
const allowedOrigins = process.env.CLIENT_DOMAIN.split(',');

// Middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// DB connection
connectDB();

// Routes
app.use('/api', apiRouter);

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Server port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
