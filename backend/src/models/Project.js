import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {type: String,required: true,trim: true},
  description: {type: String,required: true},
  internshipType: {type: String,    enum: ['Summer', 'Winter'],required: true  },
  status: {    type: String,  enum: ['active', 'completed', 'archived'],    default: 'active'},
  startDate: {    type: Date,    required: true},
  endDate: {
    type: Date,
    required: true
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  githubRepo: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The admin user who created the project
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Project', projectSchema);
