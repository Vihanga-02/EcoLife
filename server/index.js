import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { initializeFirebase } from './config/firebase.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import energyRoutes from './routes/energyRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import wasteRoutes from './routes/wasteRoutes.js';
import recyclingRoutes from './routes/recyclingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Firebase Admin
initializeFirebase();

const app = express();

// ===== Middleware =====
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== API Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/recycling', recyclingRoutes);
app.use('/api/admin', adminRoutes);

// ===== 404 Handler =====
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ===== Global Error Handler =====
app.use(errorHandler);

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌱 EcoLife Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}\n`);
});

export default app;
