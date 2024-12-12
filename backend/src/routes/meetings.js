import express from 'express';
import Meeting from '../models/Meeting.js';
import Project from '../models/Project.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/meetings (Guide schedules a meeting)
router.post('/', auth(['guide']), async (req, res) => {
  try {
    const { project, interns, scheduledFor, agenda } = req.body;

    // Check if this guide owns the project
    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ error: 'Project not found' });
    if (proj.guide.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to schedule meeting for this project' });
    }

    const newMeeting = new Meeting({
      project,
      guide: req.user.id,
      interns: interns || proj.interns,
      scheduledFor,
      agenda
    });

    const savedMeeting = await newMeeting.save();
    res.status(201).json(savedMeeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create meeting' });
  }
});

// GET /api/meetings (guideId?, projectId?)
router.get('/', auth(), async (req, res) => {
    try {
      const { guideId, projectId } = req.query;
      let filter = {};
      if (guideId) {
        // If guideId is specified
        if (req.user.role === 'guide' && guideId !== req.user.id) {
          return res.status(403).json({ error: 'Not authorized to view other guide meetings' });
        }
        filter.guide = guideId;
      }
  
      if (projectId) filter.project = projectId;
  
      // Role-based restrictions
      if (req.user.role === 'guide') {
        // guide can only see their own meetings
        filter.guide = req.user.id;
        // If projectId is given, ensure that project belongs to this guide
        if (projectId) {
          const proj = await Project.findById(projectId);
          if (!proj || proj.guide.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
          }
        }
      } else if (req.user.role === 'intern') {
        // Intern sees meetings for their projects
        const internProjects = await Project.find({ interns: req.user.id }).select('_id');
        const projectIds = internProjects.map(p => p._id.toString());
        // If projectId given, check if intern is part of it
        if (projectId && !projectIds.includes(projectId)) {
          return res.json([]); // no access
        }
        // If not given, limit by intern's projects
        if (!projectId) filter.project = { $in: projectIds };
      }
  
      // admin sees all
  
      const meetings = await Meeting.find(filter).populate('project guide interns', 'title name email');
      res.json(meetings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch meetings' });
    }
  });
  

// PATCH /api/meetings/:id (Guide only to update details)
router.patch('/:id', auth(['guide']), async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

    // Check if this guide owns the project
    const proj = await Project.findById(meeting.project);
    if (proj.guide.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { scheduledFor, agenda } = req.body;
    if (scheduledFor) meeting.scheduledFor = scheduledFor;
    if (agenda) meeting.agenda = agenda;

    const updatedMeeting = await meeting.save();
    res.json(updatedMeeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update meeting' });
  }
});

export default router;
