// routes/users.js

import express from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', auth(['admin']), async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Get a specific user (authenticated user or admin)
router.get('/:id', auth(), async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      throw new ApiError(403, 'Access denied');
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
