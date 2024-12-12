// src/models/Report.js
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  intern: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  summary: { type: String, required: true },
  reportKey: { type: String, required: true }, // S3 key of the uploaded file
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Report', reportSchema);
