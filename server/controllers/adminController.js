import User from '../models/User.js';
import WasteLog from '../models/WasteLog.js';
import MarketItem from '../models/MarketItem.js';
import MarketTransaction from '../models/MarketTransaction.js';
import RecyclingCenter from '../models/RecyclingCenter.js';
import RecyclingSubmission from '../models/RecyclingSubmission.js';
import Appliance from '../models/Appliance.js';

// Admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalMarketItems,
      totalTransactions,
      totalWasteLogs,
      totalCenters,
      pendingSubmissions,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', isActive: true }),
      MarketItem.countDocuments(),
      MarketTransaction.countDocuments({ status: 'completed' }),
      WasteLog.countDocuments(),
      RecyclingCenter.countDocuments({ isActive: true }),
      RecyclingSubmission.countDocuments({ status: 'pending' }),
    ]);

    const topUsers = await User.find({ role: 'user' })
      .sort({ greenScore: -1 })
      .limit(5)
      .select('name email greenScore profileImage');

    const recentWaste = await WasteLog.find()
      .populate('userId', 'name email')
      .sort({ date: -1 })
      .limit(5);

    const wasteByType = await WasteLog.aggregate([
      { $group: { _id: '$wasteType', total: { $sum: '$quantity' } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalMarketItems,
        completedTransactions: totalTransactions,
        totalWasteLogs,
        activeCenters: totalCenters,
        pendingSubmissions,
      },
      topUsers,
      recentWaste,
      wasteByType,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get stats' });
  }
};

// Admin: Get all users
const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get users' });
  }
};

// Admin: Toggle user active status
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot deactivate admin accounts' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to toggle user status' });
  }
};

// Admin: Get single user details
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [wasteCount, marketItems, transactions, submissions] = await Promise.all([
      WasteLog.countDocuments({ userId: user._id }),
      MarketItem.countDocuments({ ownerId: user._id }),
      MarketTransaction.countDocuments({ $or: [{ buyerId: user._id }, { sellerId: user._id }] }),
      RecyclingSubmission.countDocuments({ userId: user._id }),
    ]);

    res.status(200).json({
      success: true,
      user,
      activity: { wasteCount, marketItems, transactions, submissions },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get user' });
  }
};

export {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getUserById,
};
