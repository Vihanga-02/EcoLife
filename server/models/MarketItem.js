import mongoose from 'mongoose';

const MarketItemSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true },
  condition: {
    type: String,
    enum: ['New', 'Good', 'Fair'],
    default: 'Good',
  },
  listingType: {
    type: String,
    enum: ['Free', 'Trade'],
    default: 'Free',
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'completed'],
    default: 'available',
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('MarketItem', MarketItemSchema);
