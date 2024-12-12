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
// GET /api/users (admin only)
router.get('/', auth(['admin']), async (req, res, next) => {
  try {
    const users = await User.find().select('-password'); // omit password field
    res.json(users);
  } catch (error) {
    next(error);
  }
});
// POST /api/users (admin only)
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    // Omit password in response
    const { password: _, ...userData } = newUser.toObject();
    res.status(201).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});
// PUT /api/users/:id (admin only)
router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (email && email !== user.email) {
      // Check for email uniqueness
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email already in use' });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (password !== undefined) user.password = password; // Will be hashed on save
    if (role !== undefined) user.role = role;

    await user.save();
    const { password: _, ...userData } = user.toObject();
    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});
// DELETE /api/users/:id (admin only)
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});
// GET /api/users?role=guide
router.get('/', auth(['admin']), async (req, res) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role) query.role = role;
    
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
export default router;
