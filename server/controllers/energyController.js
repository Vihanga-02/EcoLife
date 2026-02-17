import Appliance from '../models/Appliance.js';
import Tariff from '../models/Tariff.js';
import User from '../models/User.js';

// Add a new appliance
const addAppliance = async (req, res) => {
  try {
    const { name, wattage, category } = req.body;

    if (!name || !wattage) {
      return res.status(400).json({ success: false, message: 'Name and wattage are required' });
    }

    const appliance = await Appliance.create({
      userId: req.user._id,
      name,
      wattage,
      category,
    });

    res.status(201).json({ success: true, message: 'Appliance added', appliance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to add appliance' });
  }
};

// Get all appliances for current user
const getMyAppliances = async (req, res) => {
  try {
    const appliances = await Appliance.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: appliances.length, appliances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get appliances' });
  }
};

// Update appliance
const updateAppliance = async (req, res) => {
  try {
    const appliance = await Appliance.findOne({ _id: req.params.id, userId: req.user._id });

    if (!appliance) {
      return res.status(404).json({ success: false, message: 'Appliance not found' });
    }

    const updated = await Appliance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Appliance updated', appliance: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update appliance' });
  }
};

// Delete appliance
const deleteAppliance = async (req, res) => {
  try {
    const appliance = await Appliance.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!appliance) {
      return res.status(404).json({ success: false, message: 'Appliance not found' });
    }

    res.status(200).json({ success: true, message: 'Appliance deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete appliance' });
  }
};

// Toggle appliance ON/OFF and track usage sessions
const toggleAppliance = async (req, res) => {
  try {
    const appliance = await Appliance.findOne({ _id: req.params.id, userId: req.user._id });

    if (!appliance) {
      return res.status(404).json({ success: false, message: 'Appliance not found' });
    }

    const now = new Date();

    if (appliance.status === 'off') {
      appliance.status = 'on';
      appliance.lastStartTime = now;
    } else {
      if (appliance.lastStartTime) {
        const hoursUsed = (now - appliance.lastStartTime) / (1000 * 60 * 60);
        const kwhUsed = (appliance.wattage / 1000) * hoursUsed;

        appliance.usageSessions.push({
          startTime: appliance.lastStartTime,
          endTime: now,
          kwhUsed: parseFloat(kwhUsed.toFixed(4)),
        });

        appliance.totalKwhThisMonth = parseFloat(
          (appliance.totalKwhThisMonth + kwhUsed).toFixed(4)
        );
      }
      appliance.status = 'off';
      appliance.lastStartTime = null;
    }

    await appliance.save();
    res.status(200).json({ success: true, message: `Appliance turned ${appliance.status}`, appliance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to toggle appliance' });
  }
};

// Estimate monthly electricity bill using tariff blocks
const estimateBill = async (req, res) => {
  try {
    const appliances = await Appliance.find({ userId: req.user._id });
    const tariffs = await Tariff.find({ isActive: true }).sort({ minUnits: 1 });

    const totalKwh = appliances.reduce((sum, a) => sum + (a.totalKwhThisMonth || 0), 0);

    let bill = 0;
    let matchedTariff = null;

    for (const tariff of tariffs) {
      const max = tariff.maxUnits ?? Infinity;
      if (totalKwh >= tariff.minUnits && totalKwh <= max) {
        bill = tariff.fixedCharge + totalKwh * tariff.unitRate;
        matchedTariff = tariff;
        break;
      }
    }

    res.status(200).json({
      success: true,
      totalKwh: parseFloat(totalKwh.toFixed(3)),
      estimatedBill: parseFloat(bill.toFixed(2)),
      appliances: appliances.length,
      tariffApplied: matchedTariff ? matchedTariff.blockName : 'No matching tariff',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to estimate bill' });
  }
};

// ADMIN: Tariff Management

// Create tariff block
const createTariff = async (req, res) => {
  try {
    const tariff = await Tariff.create(req.body);
    res.status(201).json({ success: true, message: 'Tariff created', tariff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create tariff' });
  }
};

// Get all tariffs
const getTariffs = async (req, res) => {
  try {
    const tariffs = await Tariff.find().sort({ minUnits: 1 });
    res.status(200).json({ success: true, tariffs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get tariffs' });
  }
};

// Update tariff
const updateTariff = async (req, res) => {
  try {
    const tariff = await Tariff.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!tariff) {
      return res.status(404).json({ success: false, message: 'Tariff not found' });
    }

    res.status(200).json({ success: true, message: 'Tariff updated', tariff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update tariff' });
  }
};

// Delete tariff
const deleteTariff = async (req, res) => {
  try {
    const tariff = await Tariff.findByIdAndDelete(req.params.id);
    if (!tariff) {
      return res.status(404).json({ success: false, message: 'Tariff not found' });
    }
    res.status(200).json({ success: true, message: 'Tariff deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete tariff' });
  }
};

export {
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
};
