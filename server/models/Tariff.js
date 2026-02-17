import mongoose from 'mongoose';

const TariffSchema = new mongoose.Schema({
  blockName: { type: String, required: true, trim: true },
  minUnits: { type: Number, required: true, min: 0 },
  maxUnits: { type: Number, default: null }, // null means unlimited
  unitRate: { type: Number, required: true, min: 0 },
  fixedCharge: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Tariff', TariffSchema);
