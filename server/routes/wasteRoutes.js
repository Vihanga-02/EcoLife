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
  analyzeWasteImage,
  getMonthlyWasteBreakdown
} from '../controllers/wasteController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../utils/multer.js';

// Admin routes
router.get('/admin/all', protect, adminOnly, adminGetAllWasteLogs);

// User waste log routes
router.route('/')
  .get(protect, getMyWasteLogs)
  .post(protect, upload.single('image'), logWaste);
// AI analysis route
router.post('/analyze', protect, upload.single('image'), analyzeWasteImage);
router.get('/monthly-breakdown', protect, getMonthlyWasteBreakdown)
router.get('/analytics', protect, getWasteAnalytics);

router.route('/:id')
  .get(protect, getWasteLogById)
  .put(protect, updateWasteLog)
  .delete(protect, deleteWasteLog);

export default router;
