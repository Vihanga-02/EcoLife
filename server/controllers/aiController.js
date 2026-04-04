import Appliance    from '../models/Appliance.js';
import BillingStats from '../models/BillingStats.js';
import { generateEnergyTips } from '../services/aiBillingStats.js';

/**
 * GET /api/ai/energy-tips
 * Generates personalised energy-saving tips for the logged-in user.
 */
const getEnergyTips = async (req, res) => {
  try {
    const appliances = await Appliance.find({ userId: req.user._id });

    // Get the most recent billing stat for context
    const lastBill = await BillingStats.findOne({ userId: req.user._id })
      .sort({ year: -1, month: -1 });

    const tips = await generateEnergyTips(appliances, lastBill);

    res.status(200).json({ success: true, tips });
  } catch (error) {
    console.error('AI tips error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate energy tips. Please try again.',
    });
  }
};

export { getEnergyTips };
