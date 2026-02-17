import mongoose from 'mongoose';

const ApplianceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String, required: true, trim: true },
  wattage: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    enum: ['Kitchen', 'Living', 'Bedroom', 'Other'],
    default: 'Other',
  },
  status: {
    type: String,
    enum: ['on', 'off'],
    default: 'off',
  },
  lastStartTime: { type: Date },
  totalKwhThisMonth: { type: Number, default: 0 },
  usageSessions: [
    {
      startTime: { type: Date },
      endTime: { type: Date },
      kwhUsed: { type: Number, default: 0 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Appliance', ApplianceSchema);
