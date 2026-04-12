import express from 'express';
import { register, login, getMe, updateProfile, getTeachers } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.patch('/me', protect, updateProfile);
router.get('/teachers', protect, getTeachers);

export default router;
