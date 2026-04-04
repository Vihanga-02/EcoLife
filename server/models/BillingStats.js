import mongoose from 'mongoose';

const BillingStatsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    year: { type: Number, required: true },
    month: { type: Number, required: true }, // 1–12
    monthLabel: { type: String, required: true }, // e.g. "March 2025"

    totalKwh: { type: Number, default: 0 },
    realTimeBill: { type: Number, default: 0 },
    estimatedBill: { type: Number, default: 0 },
    tariffApplied: { type: String, default: 'N/A' },

    // Snapshot of each appliance's usage that month
    appliances: [
        {
            name: { type: String },
            category: { type: String },
            wattage: { type: Number },
            totalKwh: { type: Number, default: 0 },
        },
    ],

    createdAt: { type: Date, default: Date.now },
});

// One record per user per year+month
BillingStatsSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

export default mongoose.model('BillingStats', BillingStatsSchema);
