import express from 'express';
import {
  getTeacherAnalytics,
  getStudentAnalytics,
  getDashboardStats,
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/teacher', protect, authorize('teacher'), getTeacherAnalytics);
router.get('/student/:studentId', protect, getStudentAnalytics);
router.get('/dashboard', protect, getDashboardStats);

export default router;
