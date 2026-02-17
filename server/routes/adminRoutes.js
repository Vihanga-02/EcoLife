import express from 'express';
const router = express.Router();
import {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getUserById,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/toggle-status', toggleUserStatus);

export default router;
