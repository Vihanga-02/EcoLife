import express from 'express';
const router = express.Router();
import {
  createItem,
  getAllItems,
  getItemById,
  getMyItems,
  updateItem,
  deleteItem,
  claimItem,
  reviewTransaction,
  getMyTransactions,
  adminGetAllItems,
  
} from '../controllers/marketplaceController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../utils/multer.js';

// Admin routes
router.get('/admin/all', protect, adminOnly, adminGetAllItems);
router.get('/admin/transactions', protect, adminOnly, adminGetAllTransactions);

// Items
router.route('/items')
  .get(getAllItems)
  .post(protect, upload.single('image'), createItem);

router.get('/my-items', protect, getMyItems);

router.route('/items/:id')
  .get(getItemById)
  .put(protect, upload.single('image'), updateItem)
  .delete(protect, deleteItem);

router.post('/items/:id/claim', protect, claimItem);

// Transactions
router.get('/transactions', protect, getMyTransactions);
router.patch('/transactions/:id/review', protect, reviewTransaction);

export default router;
