import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getMe, updateProfile, registerAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register-admin', registerAdmin);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

export default router;
