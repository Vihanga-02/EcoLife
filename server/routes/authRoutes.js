import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getMe, updateProfile, updatePassword, deleteMe, registerAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../utils/multer.js';

router.post('/register-admin', registerAdmin);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/me', protect, upload.single('image'), updateProfile);
router.patch('/me/password', protect, updatePassword);
router.delete('/me', protect, deleteMe);

export default router;
