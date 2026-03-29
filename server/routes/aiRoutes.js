import express from 'express';
const router = express.Router();
import { getEnergyTips } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

// GET /api/ai/energy-tips  — user must be logged in
router.get('/energy-tips', protect, getEnergyTips);

export default router;
