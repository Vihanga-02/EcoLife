import mongoose from 'mongoose';

const RecyclingCenterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  acceptMaterials: [{ type: String, trim: true }],
  contactNumber: { type: String, trim: true },
  operatingHours: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Enable Geo Index for nearby search
RecyclingCenterSchema.index({ location: '2dsphere' });

export default mongoose.model('RecyclingCenter', RecyclingCenterSchema);
