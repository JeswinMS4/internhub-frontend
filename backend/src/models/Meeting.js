import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  guide: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  scheduledFor: { type: Date, required: true },
  agenda: String,
  location: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Meeting', meetingSchema);
