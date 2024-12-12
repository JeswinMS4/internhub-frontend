import express from 'express';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/tasks (Guide Only)
router.post('/', auth(['guide']), async (req, res) => {
  try {
    const { project, assignedTo, title, description, dueDate } = req.body;

    // Optional: Check if this guide owns the project
    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ error: 'Project not found' });
    if (proj.guide.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to create tasks for this project' });
    }

    const newTask = new Task({
      project,
      assignedTo,
      title,
      description: description || '',
      dueDate
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});
// GET /api/tasks
router.get('/', auth(), async (req, res) => {
    try {
      const { projectId, assignedTo } = req.query;
      let filter = {};
      if (projectId) filter.project = projectId;
      if (assignedTo) filter.assignedTo = assignedTo;
  
      // Role-based restrictions
      if (req.user.role === 'guide') {
        // Find projects where this user is the guide
        const guideProjects = await Project.find({ guide: req.user.id }).select('_id');
        const guideProjectIds = guideProjects.map(p => p._id.toString());
  
        // If projectId provided, ensure it's one of guide's projects
        if (projectId && !guideProjectIds.includes(projectId)) {
          return res.json([]); // no access
        }
  
        // If no projectId given, limit tasks to only those in guide's projects
        if (!projectId) {
          filter.project = { $in: guideProjectIds };
        }
      } else if (req.user.role === 'intern') {
        // Intern can only see tasks assigned to them
        filter.assignedTo = req.user.id;
      }
      // admin sees all
  
      const tasks = await Task.find(filter).populate('project assignedTo', 'title name email');
      res.json(tasks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });
  

// PATCH /api/tasks/:id
router.patch('/:id', auth(), async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // If intern, can only update tasks assigned to them (feedback/status)
    if (req.user.role === 'intern' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // If guide, ensure they own the project related to the task
    if (req.user.role === 'guide') {
      const proj = await Project.findById(task.project);
      if (proj.guide.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
    }

    if (status) task.status = status;
    if (feedback) task.feedback = feedback;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

export default router;
