import express from 'express';
import {
  submitWPR,
  getProjectWPRs,
  getWPRById,
  deleteWPR,
} from '../controllers/wprController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/:projectId/submit', protect, authorize('student'), submitWPR);
router.get('/:projectId', protect, getProjectWPRs);
router.get('/:projectId/:id', protect, getWPRById);
router.delete('/:projectId/:id', protect, authorize('teacher'), deleteWPR);

export default router;
