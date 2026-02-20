import MarketItem from '../models/MarketItem.js';
import MarketTransaction from '../models/MarketTransaction.js';
import User from '../models/User.js';

// Create a new marketplace listing
const createItem = async (req, res) => {
  try {
    const { title, description, category, condition, listingType, imageUrl } = req.body;

    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Title and category are required' });
    }

    const item = await MarketItem.create({
      ownerId: req.user._id,
      title,
      description,
      category,
      imageUrl: imageUrl || '',
      condition,
      listingType,
    });

    res.status(201).json({ success: true, message: 'Item listed successfully', item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create item' });
  }
};

// Get all available marketplace items
const getAllItems = async (req, res) => {
  try {
    const { category, condition, listingType, page = 1, limit = 12 } = req.query;

    const filter = { status: 'available' };
    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (listingType) filter.listingType = listingType;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await MarketItem.countDocuments(filter);
    const items = await MarketItem.find(filter)
      .populate('ownerId', 'name profileImage greenScore')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get items' });
  }
};

// Get single item by ID
const getItemById = async (req, res) => {
  try {
    const item = await MarketItem.findById(req.params.id)
      .populate('ownerId', 'name profileImage greenScore email')
      .populate('claimedBy', 'name email');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get item' });
  }
};

// Get current user's listings
const getMyItems = async (req, res) => {
  try {
    const items = await MarketItem.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get items' });
  }
};

// Update a listing (owner only)
const updateItem = async (req, res) => {
  try {
    const item = await MarketItem.findOne({ _id: req.params.id, ownerId: req.user._id });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found or not yours' });
    }

    const updated = await MarketItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Item updated', item: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update item' });
  }
};

// Delete a listing (owner only)
const deleteItem = async (req, res) => {
  try {
    const item = await MarketItem.findOne({ _id: req.params.id, ownerId: req.user._id });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found or not yours' });
    }

    await item.deleteOne();
    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete item' });
  }
};

// Claim/Request an item
const claimItem = async (req, res) => {
  try {
    const item = await MarketItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Item is no longer available' });
    }

    if (item.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot claim your own item' });
    }

    const existing = await MarketTransaction.findOne({
      itemId: item._id,
      buyerId: req.user._id,
      status: 'pending',
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have a pending request for this item' });
    }

    const transaction = await MarketTransaction.create({
      itemId: item._id,
      sellerId: item.ownerId,
      buyerId: req.user._id,
    });

    item.status = 'reserved';
    item.claimedBy = req.user._id;
    await item.save();

    res.status(201).json({ success: true, message: 'Claim request sent', transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to claim item' });
  }
};

// Approve or reject a transaction (seller)
const reviewTransaction = async (req, res) => {
  try {
    const { action } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Action must be approve or reject' });
    }

    const transaction = await MarketTransaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the seller can review this request' });
    }

    const item = await MarketItem.findById(transaction.itemId);

    if (action === 'approve') {
      transaction.status = 'completed';
      transaction.completedAt = new Date();
      if (item) {
        item.status = 'completed';
        await item.save();
      }
      await User.findByIdAndUpdate(transaction.sellerId, { $inc: { greenScore: 10, totalTransactions: 1 } });
      await User.findByIdAndUpdate(transaction.buyerId, { $inc: { greenScore: 5, totalTransactions: 1 } });
    } else {
      transaction.status = 'rejected';
      if (item) {
        item.status = 'available';
        item.claimedBy = null;
        await item.save();
      }
    }

    await transaction.save();
    res.status(200).json({ success: true, message: `Transaction ${action}d`, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to review transaction' });
  }
};

// Get all transactions for current user (as buyer or seller)
const getMyTransactions = async (req, res) => {
  try {
    const transactions = await MarketTransaction.find({
      $or: [{ buyerId: req.user._id }, { sellerId: req.user._id }],
    })
      .populate('itemId', 'title imageUrl category')
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get transactions' });
  }
};

// Admin: Get all marketplace items
const adminGetAllItems = async (req, res) => {
  try {
    const items = await MarketItem.find()
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get items' });
  }
};

export {
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
};
