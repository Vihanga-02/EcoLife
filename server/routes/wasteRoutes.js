import express from 'express';
const router = express.Router();
import {
  logWaste,
  getMyWasteLogs,
  getWasteAnalytics,
  getWasteLogById,
  deleteWasteLog,
  updateWasteLog,
  adminGetAllWasteLogs,
} from '../controllers/wasteController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../utils/multer.js';

// Admin
router.get('/admin/all', protect, adminOnly, adminGetAllWasteLogs);

// User routes
router.route('/')
  .get(protect, getMyWasteLogs)
  .post(protect, upload.single('image'), logWaste);

router.get('/analytics', protect, getWasteAnalytics);

router.route('/:id')
  .get(protect, getWasteLogById)
  .put(protect, updateWasteLog) 
  .delete(protect, deleteWasteLog);

export default router;
