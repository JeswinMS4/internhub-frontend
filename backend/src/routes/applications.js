import express from 'express';
import multer from 'multer';
import AWS from '../config/awsConfig.js';
import Application from '../models/Application.js';
import { extractResumeData } from '../utils/resumeProcessor.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import User from '../models/User.js'; 
dotenv.config();
const router = express.Router();

// Configure Multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to upload resume and extract data
router.post('/upload-resume', upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    // Extract text and fields from the resume
    const extractedData = await extractResumeData(req.file);

    res.status(200).json({ data: extractedData });
  } catch (error) {
    console.error('Error in /upload-resume:', error);
    res.status(500).json({ error: error.message || 'An error occurred during resume processing.' });
  }
});

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

    // Create a new application object
    const applicationData = {
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
    };

    // Handle resume file upload
    let key;
    if (req.file) {
      key = `resumes/${Date.now()}-${req.file.originalname}`;

      // Upload resume to S3
      const s3 = new AWS.S3();
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const s3Response = await s3.upload(params).promise();

      applicationData.resumeKey = key;
    }

    const newApplication = new Application(applicationData);

    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Error in application submission:', err);
    res.status(500).json({ error: err.message || 'An error occurred during application submission.' });
  }
});

// Inside your GET endpoint for fetching applications

router.get('/', async (req, res, next) => {
  try {
    const applications = await Application.find();

    const s3 = new AWS.S3();

    const applicationsWithPresignedUrls = applications.map((application) => {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: application.resumeKey, // Use the stored key directly
        Expires: 60 * 60, // 1 hour expiry
      };

      const presignedUrl = s3.getSignedUrl('getObject', params);

      return {
        ...application.toObject(),
        resumeUrl: presignedUrl, // This URL can be used to access the resume
      };
    });

    res.json(applicationsWithPresignedUrls);
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

// PUT /api/applications/:id/approve
router.put('/:id/approve', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { internEmail, internPassword } = req.body; 
    // internEmail: something@internhub.com
    // internPassword: chosen by the admin

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if the email ends with @internhub.com
    if (!internEmail.endsWith('@internhub.com')) {
      return res.status(400).json({ error: 'Email must end with @internhub.com' });
    }

    // Ensure not already approved
    if (application.status === 'approved' && application.userId) {
      return res.status(400).json({ error: 'Application already approved and user created' });
    }

    // Create user credentials
    const hashedPassword = await bcrypt.hash(internPassword, 10);

    // Check if user with internEmail already exists
    const existingUser = await User.findOne({ email: internEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this intern email already exists' });
    }

    const internUser = new User({
      name: application.name,
      email: internEmail,
      password: internPassword, // store the plaintext here
      role: 'intern'
    });
    
    await internUser.save(); // pre save hook will hash this password

    // Update application
    application.status = 'approved';
    application.userId = internUser._id;
    await application.save();

    // Configure nodemailer transporter
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   secure: false, 
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      to: application.email, // The intern's personal email from the application
      subject: 'Your InternHub Credentials',
      text: `Hello ${internUser.name},\n\nYour InternHub credentials:\nEmail: ${internUser.email}\nPassword: ${internPassword}\n\nPlease login to start.`,
    });

    res.json({ message: 'Application approved, user created, and credentials sent to interns personal email.' });
  } catch (err) {
    console.error('Error in approving application:', err);
    next(err);
  }
});
 
export default router;
