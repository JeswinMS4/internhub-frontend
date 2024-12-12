import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['todo', 'in_progress', 'completed'], default: 'todo' },
  feedback: String,
  dueDate: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', taskSchema);
