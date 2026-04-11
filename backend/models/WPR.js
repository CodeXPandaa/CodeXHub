import mongoose from 'mongoose';

const wprSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Please specify a project'],
  },
  weekNumber: {
    type: Number,
    required: [true, 'Please specify the week number'],
    min: 1,
  },
  progressDescription: {
    type: String,
    required: [true, 'Please provide progress description'],
    minlength: 10,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify who submitted'],
  },
  file: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate week numbers for the same project
wprSchema.index({ project: 1, weekNumber: 1 }, { unique: true });

const WPR = mongoose.model('WPR', wprSchema);

export default WPR;
