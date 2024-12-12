import express from 'express';
import Project from '../models/Project.js'; // Import the Project Mongoose model
import { auth } from '../middleware/auth.js';
const router = express.Router();

// GET /api/projects
// query params: guideId, internId
router.get('/', auth(), async (req, res) => {
  try {
    const { guideId, internId } = req.query;
    let filter = {};

    // If query params provided, respect them first
    if (guideId) {
      // If the logged-in user is admin or program_manager, they can view any guide's projects
      // If user is a guide, ensure guideId matches their own id or deny
      if (req.user.role === 'guide' && guideId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to view other guides projects' });
      }
      filter.guide = guideId;
    }

    if (internId) {
      // If internId is provided, admin can see any intern's projects
      // Guide should see interns in their projects only; 
      // but since we are just filtering by intern, admin role can see all.
      // For a guide, you might need additional checks:
      // After finding projects that have interns = internId, ensure those projects belong to this guide if role=guide
      filter.interns = internId;
    }

    // If no filter was set and user not admin:
    if (!guideId && !internId) {
      if (req.user.role === 'guide') {
        // A guide should only see their projects
        filter.guide = req.user.id;
      } else if (req.user.role === 'intern') {
        // An intern should only see projects they are assigned to
        filter.interns = req.user.id;
      }
      // admin sees all projects, so no additional filter required
    }

    const projects = await Project.find(filter).populate('guide interns createdBy', 'name email role');

    // Additional logic if needed: For guides, ensure all returned projects have project.guide = req.user.id
    if (req.user.role === 'guide') {
      const filtered = projects.filter(p => p.guide._id.toString() === req.user.id);
      return res.json(filtered);
    }

    if (req.user.role === 'intern') {
      const filtered = projects.filter(p => p.interns.some(i => i._id.toString() === req.user.id));
      return res.json(filtered);
    }

    // Admin or other roles return as is
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});
  // GET endpoint to retrieve statistics
  router.get('/stats', async (req, res, next) => {
    try {
      const totalProjects = await Project.countDocuments();
      const newProjects= await Project.countDocuments({
        submittedAt: { $gte: new Date(new Date().setDate(1)) }, // Projects in the current month
      });
  
      res.json({
        totalProjects,
        newProjects,
        // Add more stats as needed
      });
    } catch (err) {
      next(err);
    }
  });
// POST create a new project
router.post('/', async (req, res) => {
  try {
    // Extract fields from req.body
    const {
      title,
      description,
      internshipType,
      startDate,
      endDate,
      guide,
      interns,
      createdBy,
      githubRepo
    } = req.body;

    // Create a new Project instance
    const newProject = new Project({
      title,
      description,
      internshipType,
      startDate,
      endDate,
      guide,
      interns: interns || [], // fallback to empty array if undefined
      createdBy,
      githubRepo: githubRepo || null
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT update a project by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedFields = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true } // return the updated project
    ).populate('guide interns createdBy', 'name email role');

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id (admin only)
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
