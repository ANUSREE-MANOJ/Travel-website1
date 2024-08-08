import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import hotelRoutes from './routes/hotelRoute.js';
import orderRoutes from './routes/orderRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Connect to database
connectDB();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Allow only this origin to access the server
  credentials: true, // Allow credentials (cookies, etc.)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Log to verify environment variables

// Routes
app.use("/api/users", userRoutes);
app.use('/api/package', packageRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/orders', orderRoutes);

// PayPal configuration route
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
