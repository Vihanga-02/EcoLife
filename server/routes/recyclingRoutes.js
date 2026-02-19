import express from 'express';
const router = express.Router();
import {
  getAllCenters,
  getNearbyCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
  createSubmission,
  getMySubmissions,
  getAllSubmissions,
  reviewSubmission,
} from '../controllers/recyclingController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

// Centers
router.route('/centers')
  .get(getAllCenters)
  .post(protect, adminOnly, createCenter);

router.get('/centers/nearby', getNearbyCenters);

router.route('/centers/:id')
  .get(getCenterById)
  .put(protect, adminOnly, updateCenter)
  .delete(protect, adminOnly, deleteCenter);

// Submissions
router.route('/submissions')
  .get(protect, adminOnly, getAllSubmissions)
  .post(protect, createSubmission);

router.get('/submissions/me', protect, getMySubmissions);
router.patch('/submissions/:id/review', protect, adminOnly, reviewSubmission);

export default router;
