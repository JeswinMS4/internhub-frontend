import express from 'express';
import { projects } from '../data/mockData.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(projects);
});

router.post('/', (req, res) => {
  const newProject = {
    id: String(projects.length + 1),
    ...req.body,
  };
  
  projects.push(newProject);
  res.status(201).json(newProject);
});

router.put('/:id', (req, res) => {
  const index = projects.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Project not found' });
  }

  projects[index] = { ...projects[index], ...req.body };
  res.json(projects[index]);
});

export default router;