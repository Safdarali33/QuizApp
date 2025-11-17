import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

// Routes
import authRoutes from './routes/auth';
import quizRoutes from './routes/quizzes';

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://quizapp-1-u5rj.onrender.com',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('🚫 CORS blocked for origin:', origin);
      return callback(new Error('CORS Blocked'), false);
    }
    
    console.log('✅ CORS allowed for origin:', origin);
    return callback(null, true);
  },
  credentials: true,
  exposedHeaders: ['set-cookie']
}));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Backend is running correctly'
  });
});


// 🔥 FIX FOR EXPRESS v5 — serve frontend
const __dirnamePath = path.resolve();

app.use(express.static(path.join(__dirnamePath, 'frontend', 'dist')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirnamePath, 'frontend', 'dist', 'index.html'));
});


// Database connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    setTimeout(() => {
      mongoose.connect(process.env.MONGODB_URI!);
    }, 5000);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
});
