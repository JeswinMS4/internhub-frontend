// models/Application.js

import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  highestQualification: { type: String, required: true },
  institution: { type: String, required: true },
  cgpa: { type: Number, required: true },
  graduationYear: { type: Number, required: true },
  class12Marks: { type: Number, required: true },
  class12Board: { type: String, required: true },
  class12YearOfPassing: { type: Number, required: true },
  class10Marks: { type: Number, required: true },
  class10Board: { type: String, required: true },
  class10YearOfPassing: { type: Number, required: true },
  //resumeUrl: { type: String, required: true },
  status: { type: String, default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  resumeKey:{ type: String, required: true }
});

const Application = mongoose.model('Application', ApplicationSchema);

export default Application;
