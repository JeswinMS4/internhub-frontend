// index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import meetingRoutes from './routes/meetings.js';

import applicationRoutes from './routes/applications.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const allowedOrigins = [
  'http://13.235.49.104:5173',
  'http://localhost:5173',
  'https://your-production-domain.com'
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, // Replace with your frontend URL
  credentials: true,
}));
app.use(express.json());

// Serve uploaded resumes
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/meetings', meetingRoutes);

// Error handling
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
