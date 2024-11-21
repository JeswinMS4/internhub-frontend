// routes/applications.js

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Application from '../models/Application.js';

const router = express.Router();

// Ensure uploads/resumes directory exists
const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST endpoint to submit application data
router.post('/', upload.single('resume'), async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      dateOfBirth,
      highestQualification,
      institution,
      cgpa,
      graduationYear,
      class12Marks,
      class12Board,
      class12YearOfPassing,
      class10Marks,
      class10Board,
      class10YearOfPassing,
    } = req.body;

    // Check if resume file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    const newApplication = new Application({
      name,
      email,
      phone,
      gender,
      dateOfBirth,
      highestQualification,
      institution,
      cgpa,
      graduationYear,
      class12Marks,
      class12Board,
      class12YearOfPassing,
      class10Marks,
      class10Board,
      class10YearOfPassing,
      resumePath: req.file.path,
    });

    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET endpoint to retrieve all application data
router.get('/', async (req, res, next) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (err) {
    next(err);
  }
});
// PUT endpoint to update application status
router.put('/:id/status', async (req, res, next) => {
    try {
      const { status } = req.body;
      const { id } = req.params;
  
      if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
  
      const application = await Application.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
  
      res.json({ message: 'Application status updated', application });
    } catch (err) {
      next(err);
    }
  });
  // GET endpoint to retrieve statistics
router.get('/stats', async (req, res, next) => {
    try {
      const totalApplications = await Application.countDocuments();
      const newApplications = await Application.countDocuments({
        submittedAt: { $gte: new Date(new Date().setDate(1)) }, // Applications in the current month
      });
  
      res.json({
        totalApplications,
        newApplications,
        // Add more stats as needed
      });
    } catch (err) {
      next(err);
    }
  });
  
export default router;
