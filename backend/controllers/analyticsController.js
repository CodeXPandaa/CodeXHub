import Project from '../models/Project.js';
import User from '../models/User.js';
import WPR from '../models/WPR.js';

// @desc    Get teacher analytics
// @route   GET /api/analytics/teacher
// @access  Private/Teacher
export const getTeacherAnalytics = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Get all projects for this teacher
    const projects = await Project.find({ guide: teacherId })
      .populate('students', 'name email');

    // Calculate statistics
    const totalProjects = projects.length;
    const pendingProjects = projects.filter(p => p.status === 'pending').length;
    const approvedProjects = projects.filter(p => p.status === 'approved').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const rejectedProjects = projects.filter(p => p.status === 'rejected').length;

    // Calculate average progress
    const avgProgress = totalProjects > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects)
      : 0;

    // Get pending approvals
    const pendingApprovals = await Project.find({
      guide: teacherId,
      status: 'pending',
    }).populate('students', 'name email semester department');

    // Get recent WPRs
    const recentWPRs = await WPR.find({
      project: { $in: projects.map(p => p._id) },
    })
      .populate('project', 'title')
      .populate('submittedBy', 'name')
      .sort({ date: -1 })
      .limit(5);

    // Status distribution for charts
    const statusDistribution = {
      pending: pendingProjects,
      approved: approvedProjects,
      completed: completedProjects,
      rejected: rejectedProjects,
    };

    // Progress distribution
    const progressRanges = {
      '0-25%': projects.filter(p => p.progress >= 0 && p.progress <= 25).length,
      '26-50%': projects.filter(p => p.progress > 25 && p.progress <= 50).length,
      '51-75%': projects.filter(p => p.progress > 50 && p.progress <= 75).length,
      '76-100%': projects.filter(p => p.progress > 75).length,
    };

    res.json({
      statistics: {
        totalProjects,
        pendingProjects,
        approvedProjects,
        completedProjects,
        rejectedProjects,
        avgProgress,
      },
      pendingApprovals,
      recentWPRs,
      charts: {
        statusDistribution,
        progressRanges,
      },
      projects,
    });
  } catch (error) {
    console.error('Get teacher analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get student analytics
// @route   GET /api/analytics/student/:studentId
// @access  Private
export const getStudentAnalytics = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check authorization
    if (studentId !== req.user._id.toString() && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized to view this analytics' });
    }

    // Get student's projects
    const projects = await Project.find({
      students: studentId,
    }).populate('guide', 'name email');

    // Calculate statistics
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'approved').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const pendingProjects = projects.filter(p => p.status === 'pending').length;

    // Average progress
    const avgProgress = totalProjects > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects)
      : 0;

    // Get WPR count
    const projectIds = projects.map(p => p._id);
    const totalWPRs = await WPR.countDocuments({
      project: { $in: projectIds },
    });

    // Get recent WPRs
    const recentWPRs = await WPR.find({
      project: { $in: projectIds },
      submittedBy: studentId,
    })
      .populate('project', 'title')
      .sort({ date: -1 })
      .limit(5);

    res.json({
      statistics: {
        totalProjects,
        activeProjects,
        completedProjects,
        pendingProjects,
        avgProgress,
        totalWPRs,
      },
      recentWPRs,
      projects,
    });
  } catch (error) {
    console.error('Get student analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get dashboard stats (quick overview)
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const { role } = req.user;

    if (role === 'teacher') {
      const projects = await Project.find({ guide: req.user._id });
      const pendingCount = projects.filter(p => p.status === 'pending').length;
      const activeCount = projects.filter(p => p.status === 'approved').length;

      res.json({
        pendingApprovals: pendingCount,
        activeProjects: activeCount,
        totalProjects: projects.length,
      });
    } else {
      const projects = await Project.find({ students: req.user._id });
      const activeCount = projects.filter(p => p.status === 'approved').length;
      const completedCount = projects.filter(p => p.status === 'completed').length;

      res.json({
        activeProjects: activeCount,
        completedProjects: completedCount,
        totalProjects: projects.length,
        avgProgress: projects.length > 0
          ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
          : 0,
      });
    }
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
