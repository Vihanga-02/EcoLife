import Appliance from '../models/Appliance.js';
import Tariff from '../models/Tariff.js';
import User from '../models/User.js';

// Add a new appliance
const addAppliance = async (req, res) => {
  try {
    const { name, wattage, category, noOfHoursForDay, noOfDaysForMonth } = req.body;

    if (!name || !wattage) {
      return res.status(400).json({ success: false, message: 'Name and wattage are required' });
    }

    const appliance = await Appliance.create({
      userId: req.user._id,
      name,
      wattage,
      category,
      noOfHoursForDay: noOfHoursForDay !== undefined ? noOfHoursForDay : 0,
      noOfDaysForMonth: noOfDaysForMonth !== undefined ? noOfDaysForMonth : 0,
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

// Get real-time electricity bill using tracked usage (toggle on/off sessions)
const realTimeBill = async (req, res) => {
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
      realTimeBill: parseFloat(bill.toFixed(2)),
      appliances: appliances.length,
      tariffApplied: matchedTariff ? matchedTariff.blockName : 'No matching tariff',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to calculate real-time bill' });
  }
};

// Estimate monthly electricity bill using configured hours/days per appliance
const estimateBill = async (req, res) => {
  try {
    const appliances = await Appliance.find({ userId: req.user._id });
    const tariffs = await Tariff.find({ isActive: true }).sort({ minUnits: 1 });

    // Per-appliance estimated monthly kWh based on wattage, hours per day, and days per month
    const applianceEstimates = appliances.map((a) => {
      const hoursPerDay = a.noOfHoursForDay || 0;
      const daysPerMonth = a.noOfDaysForMonth || 0;
      const estimatedKwhPerMonth = (a.wattage / 1000) * hoursPerDay * daysPerMonth;

      return {
        applianceId: a._id,
        name: a.name,
        wattage: a.wattage,
        noOfHoursForDay: hoursPerDay,
        noOfDaysForMonth: daysPerMonth,
        estimatedKwhPerMonth: parseFloat(estimatedKwhPerMonth.toFixed(3)),
      };
    });

    const totalEstimatedKwh = applianceEstimates.reduce(
      (sum, a) => sum + a.estimatedKwhPerMonth,
      0
    );

    let bill = 0;
    let matchedTariff = null;

    for (const tariff of tariffs) {
      const max = tariff.maxUnits ?? Infinity;
      if (totalEstimatedKwh >= tariff.minUnits && totalEstimatedKwh <= max) {
        bill = tariff.fixedCharge + totalEstimatedKwh * tariff.unitRate;
        matchedTariff = tariff;
        break;
      }
    }

    const effectiveUnitRate =
      totalEstimatedKwh > 0 ? bill / totalEstimatedKwh : 0;

    const appliancesWithCost = applianceEstimates.map((a) => ({
      ...a,
      estimatedCostPerMonth: parseFloat(
        (a.estimatedKwhPerMonth * effectiveUnitRate).toFixed(2)
      ),
    }));

    res.status(200).json({
      success: true,
      totalEstimatedKwh: parseFloat(totalEstimatedKwh.toFixed(3)),
      totalEstimatedBill: parseFloat(bill.toFixed(2)),
      appliances: appliancesWithCost,
      tariffApplied: matchedTariff ? matchedTariff.blockName : 'No matching tariff',
      effectiveUnitRate: parseFloat(effectiveUnitRate.toFixed(4)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to estimate bill',
    });
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
  realTimeBill,
  estimateBill,
  createTariff,
  getTariffs,
  updateTariff,
  deleteTariff,
};
