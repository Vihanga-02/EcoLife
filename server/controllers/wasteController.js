import WasteLog from '../models/WasteLog.js';
import User from '../models/User.js';
import { analyzeImageBuffer } from '../services/visionService.js';
import { classifyWaste } from '../utils/wasteClassifier.js';


const CARBON_FACTORS = {
  Plastic: 2.0,
  Paper: 1.0,
  Glass: 0.5,
  Organic: 0.3,
  'E-waste': 20.0,
};

const BIODEGRADABLE_TYPES = ['Organic', 'Paper'];
const RECYCLABLE_TYPES = ['Plastic', 'Paper', 'Glass', 'E-waste'];

// Log waste entry
const logWaste = async (req, res) => {
  try {
    const { wasteType, quantity, unit, notes, imageUrl } = req.body;

    if (!wasteType || !quantity) {
      return res.status(400).json({ success: false, message: 'wasteType and quantity are required' });
    }

    const isBiodegradable = BIODEGRADABLE_TYPES.includes(wasteType);
    const isRecyclable = RECYCLABLE_TYPES.includes(wasteType);
    const carbonFactor = CARBON_FACTORS[wasteType] || 1.0;
    const carbonEquivalent = parseFloat((quantity * carbonFactor).toFixed(3));

    const log = await WasteLog.create({
      userId: req.user._id,
      wasteType,
      quantity,
      unit,
      imageUrl: imageUrl || '',
      isBiodegradable,
      isRecyclable,
      carbonEquivalent,
      notes,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { greenScore: 2 } });

    res.status(201).json({ success: true, message: 'Waste logged successfully', log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to log waste' });
  }
};

// Get all waste logs for current user
const getMyWasteLogs = async (req, res) => {
  try {
    const { wasteType, startDate, endDate, page = 1, limit = 20 } = req.query;

    const filter = { userId: req.user._id };
    if (wasteType) filter.wasteType = wasteType;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await WasteLog.countDocuments(filter);
    const logs = await WasteLog.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get waste logs' });
  }
};

// Get user waste analytics summary
const getWasteAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const logs = await WasteLog.find({ userId });

    const totalByType = {};
    let totalCarbon = 0;
    let recyclableCount = 0;
    let biodegradableCount = 0;

    logs.forEach((log) => {
      totalByType[log.wasteType] = (totalByType[log.wasteType] || 0) + log.quantity;
      totalCarbon += log.carbonEquivalent || 0;
      if (log.isRecyclable) recyclableCount++;
      if (log.isBiodegradable) biodegradableCount++;
    });

    res.status(200).json({
      success: true,
      totalLogs: logs.length,
      totalByType,
      totalCarbonEquivalent: parseFloat(totalCarbon.toFixed(3)),
      recyclableItems: recyclableCount,
      biodegradableItems: biodegradableCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get analytics' });
  }
};

// Get a single waste log by ID for the authenticated user
const getWasteLogById = async (req, res) => {
  try {
    const log = await WasteLog.findOne({ _id: req.params.id, userId: req.user._id });

    if (!log) {
      return res.status(404).json({ success: false, message: 'Waste log not found' });
    }

    res.status(200).json({ success: true, log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get waste log' });
  }
};

// Update waste log
const updateWasteLog = async (req, res) => {
  try {
    const log = await WasteLog.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Waste log not found'
      });
    }

    const { wasteType, quantity, unit, notes } = req.body;

    // Update basic fields if provided
    if (wasteType) log.wasteType = wasteType;
    if (quantity !== undefined) log.quantity = quantity;
    if (unit) log.unit = unit;
    if (notes !== undefined) log.notes = notes;

    // Recalculate biodegradable / recyclable
    log.isBiodegradable = BIODEGRADABLE_TYPES.includes(log.wasteType);
    log.isRecyclable = RECYCLABLE_TYPES.includes(log.wasteType);

    // Recalculate carbon equivalent
    const carbonFactor = CARBON_FACTORS[log.wasteType] || 1.0;
    log.carbonEquivalent = parseFloat(
      (log.quantity * carbonFactor).toFixed(3)
    );

    const updated = await log.save();

    res.status(200).json({
      success: true,
      message: 'Waste log updated successfully',
      log: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update waste log'
    });
  }
};

// Delete waste log
const deleteWasteLog = async (req, res) => {
  try {
    const log = await WasteLog.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!log) {
      return res.status(404).json({ success: false, message: 'Waste log not found' });
    }

    res.status(200).json({ success: true, message: 'Waste log deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete waste log' });
  }
};

// Get all waste logs (Admin only)
const adminGetAllWasteLogs = async (req, res) => {
  try {
    const logs = await WasteLog.find()
      .populate('userId', 'name email')
      .sort({ date: -1 });
    res.status(200).json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get waste logs' });
  }
};

//Analyze uploaded waste image using Google Vision API
const analyzeWasteImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
         message: 'No image uploaded for analysis'
         });
    }

    //buffer check
    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Uploaded file is empty'
      });
    }

    // Call Google Vision API via our service
    const labels = await analyzeImageBuffer(req.file.buffer);


    //Ensure Vision API returned valid labels before classification
    if (!labels || labels.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not detect any waste type from image'
      });
    } 

    // Classify based on detected labels
    const classification = classifyWaste(labels);

    res.status(200).json({
      success: true,
      data: classification,
      message: `Detected category: ${classification.wasteType}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze image'
    });
  }
};


export {
  logWaste,
  getMyWasteLogs,
  getWasteAnalytics,
  getWasteLogById,
  deleteWasteLog,
  adminGetAllWasteLogs,
  updateWasteLog,
  analyzeWasteImage 
};
