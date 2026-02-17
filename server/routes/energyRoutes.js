import express from 'express';
const router = express.Router();
import {
  addAppliance,
  getMyAppliances,
  updateAppliance,
  deleteAppliance,
  toggleAppliance,
  estimateBill,
  createTariff,
  getTariffs,
  updateTariff,
  deleteTariff,
} from '../controllers/energyController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

// Appliance routes
router.route('/appliances')
  .get(protect, getMyAppliances)
  .post(protect, addAppliance);

router.route('/appliances/:id')
  .put(protect, updateAppliance)
  .delete(protect, deleteAppliance);

router.patch('/appliances/:id/toggle', protect, toggleAppliance);

// Bill estimation
router.get('/estimate-bill', protect, estimateBill);

// Tariff routes
router.route('/tariffs')
  .get(protect, getTariffs)
  .post(protect, adminOnly, createTariff);

router.route('/tariffs/:id')
  .put(protect, adminOnly, updateTariff)
  .delete(protect, adminOnly, deleteTariff);

export default router;
