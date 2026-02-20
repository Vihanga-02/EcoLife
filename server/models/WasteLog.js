import mongoose from 'mongoose';

const WasteLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  wasteType: {
    type: String,
    enum: ['Plastic', 'Paper', 'Glass', 'Organic', 'E-waste'],
    required: true,
  },
  quantity: { type: Number, required: true, min: 0 },
  unit: {
    type: String,
    enum: ['kg', 'count'],
    default: 'kg',
  },
  imageUrl: { type: String, default: '' },
  isBiodegradable: { type: Boolean, default: false },
  isRecyclable: { type: Boolean, default: false },
  carbonEquivalent: { type: Number, default: 0 },
  notes: { type: String, trim: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model('WasteLog', WasteLogSchema);
