import mongoose from 'mongoose';

const RecyclingSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  centerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecyclingCenter',
    required: true,
  },
  materialType: { type: String, required: true, trim: true },
  estimatedWeight: { type: Number, required: true, min: 0 },
  unit: {
    type: String,
    enum: ['kg'],
    default: 'kg',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  reviewNotes: { type: String, trim: true },
  reviewedAt: { type: Date, default: null },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model('RecyclingSubmission', RecyclingSubmissionSchema);
