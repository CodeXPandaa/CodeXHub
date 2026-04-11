import WPR from '../models/WPR.js';
import Project from '../models/Project.js';

// @desc    Submit WPR
// @route   POST /api/wpr/:projectId/submit
// @access  Private/Student
export const submitWPR = async (req, res) => {
  try {
    const { weekNumber, progressDescription, file } = req.body;
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is a student in the project
    const isStudent = project.students.some(
      s => s.toString() === req.user._id.toString()
    );
    if (!isStudent) {
      return res.status(403).json({ message: 'Not authorized to submit WPR for this project' });
    }

    // Check if WPR for this week already exists
    const existingWPR = await WPR.findOne({
      project: projectId,
      weekNumber,
    });

    if (existingWPR) {
      return res.status(400).json({ message: 'WPR for this week already submitted' });
    }

    // Create WPR
    const wpr = await WPR.create({
      project: projectId,
      weekNumber,
      progressDescription,
      submittedBy: req.user._id,
      file,
    });

    // Update project progress (10% per WPR, max 100%)
    const newProgress = Math.min(100, project.progress + 10);
    await Project.findByIdAndUpdate(projectId, { progress: newProgress });

    res.status(201).json(wpr);
  } catch (error) {
    console.error('Submit WPR error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get project WPRs
// @route   GET /api/wpr/:projectId
// @access  Private
export const getProjectWPRs = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    const isStudent = project.students.some(
      s => s.toString() === req.user._id.toString()
    );
    const isGuide = project.guide.toString() === req.user._id.toString();

    if (!isStudent && !isGuide) {
      return res.status(403).json({ message: 'Not authorized to view WPRs' });
    }

    const wprs = await WPR.find({ project: projectId })
      .populate('submittedBy', 'name email')
      .sort({ weekNumber: 1 });

    res.json(wprs);
  } catch (error) {
    console.error('Get WPRs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get specific WPR
// @route   GET /api/wpr/:projectId/:id
// @access  Private
export const getWPRById = async (req, res) => {
  try {
    const { projectId, id } = req.params;

    const wpr = await WPR.findOne({
      _id: id,
      project: projectId,
    }).populate('submittedBy', 'name email');

    if (!wpr) {
      return res.status(404).json({ message: 'WPR not found' });
    }

    // Check project authorization
    const project = await Project.findById(projectId);
    const isStudent = project.students.some(
      s => s.toString() === req.user._id.toString()
    );
    const isGuide = project.guide.toString() === req.user._id.toString();

    if (!isStudent && !isGuide) {
      return res.status(403).json({ message: 'Not authorized to view this WPR' });
    }

    res.json(wpr);
  } catch (error) {
    console.error('Get WPR error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete WPR
// @route   DELETE /api/wpr/:projectId/:id
// @access  Private/Teacher
export const deleteWPR = async (req, res) => {
  try {
    const { projectId, id } = req.params;

    const wpr = await WPR.findOne({
      _id: id,
      project: projectId,
    });

    if (!wpr) {
      return res.status(404).json({ message: 'WPR not found' });
    }

    // Check if user is the guide
    const project = await Project.findById(projectId);
    if (project.guide.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this WPR' });
    }

    await wpr.deleteOne();

    // Recalculate project progress
    const wprCount = await WPR.countDocuments({ project: projectId });
    await Project.findByIdAndUpdate(projectId, {
      progress: Math.min(100, wprCount * 10),
    });

    res.json({ message: 'WPR deleted successfully' });
  } catch (error) {
    console.error('Delete WPR error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
