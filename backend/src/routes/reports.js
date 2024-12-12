// src/routes/reports.js
import express from 'express';
import multer from 'multer';
import AWS from '../config/awsConfig.js';
import Report from '../models/Report.js';
import { auth } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/reports
// Intern uploads weekly report
router.post('/', auth(['intern']), upload.single('report'), async (req, res) => {
  try {
    const { projectId, summary } = req.body;
    const internId = req.user.id; // from auth token

    if (!projectId || !summary) {
      return res.status(400).json({ error: 'projectId and summary are required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Report file is required' });
    }

    // Upload file to S3
    const s3 = new AWS.S3();
    const key = `reports/${Date.now()}-${req.file.originalname}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    await s3.upload(params).promise();

    const newReport = new Report({
      project: projectId,
      intern: internId,
      summary,
      reportKey: key
    });

    await newReport.save();
    res.status(201).json({ message: 'Weekly report uploaded successfully', report: newReport });
  } catch (err) {
    console.error('Error uploading report:', err);
    res.status(500).json({ error: 'An error occurred during report upload.' });
  }
});



// GET /api/reports?projectId=&internId=
// Returns filtered reports based on role and query parameters.
router.get('/', auth(), async (req, res) => {
    try {
      const { projectId, internId } = req.query;
      const filter = {};
  
      if (projectId) filter.project = projectId;
      if (internId) filter.intern = internId;
  
      // Role-based restrictions:
      if (req.user.role === 'intern') {
        // Intern can only see their own reports
        filter.intern = req.user.id;
      } else if (req.user.role === 'guide') {
        // Guide can only see reports for projects they guide
        // Find projects where this user is guide
        const guideProjects = await Project.find({ guide: req.user.id }).select('_id');
        const guideProjectIds = guideProjects.map(p => p._id.toString());
  
        // If projectId was specified, ensure it's in guideProjectIds
        if (projectId && !guideProjectIds.includes(projectId)) {
          return res.json([]); // no access to this project's reports
        }
  
        // If no projectId given, limit all reports to guide’s projects
        if (!projectId) {
          filter.project = { $in: guideProjectIds };
        }
      }
      // Admin can see all matching reports. No change needed.
  
      const reports = await Report.find(filter)
        .populate('intern', 'name email')
        .populate('project', 'title');
  
      const s3 = new AWS.S3();
      const results = reports.map(report => {
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: report.reportKey,
          Expires: 60 * 60, // 1 hour expiry
        };
  
        const presignedUrl = s3.getSignedUrl('getObject', params);
        return {
          ...report.toObject(),
          reportUrl: presignedUrl
        };
      });
  
      res.json(results);
    } catch (err) {
      console.error('Error fetching reports:', err);
      res.status(500).json({ error: 'An error occurred while fetching reports.' });
    }
  });

export default router;
