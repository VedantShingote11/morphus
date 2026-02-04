import mongoose from 'mongoose';

const LenderProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    walletBalance: {
        type: Number,
        default: 100000, // Starting simulated balance
        min: 0,
    },
    totalInvested: {
        type: Number,
        default: 0,
    },
    totalReturns: {
        type: Number,
        default: 0,
    },
    activeLoanCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update timestamp on save
LenderProfileSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.models.LenderProfile || mongoose.model('LenderProfile', LenderProfileSchema);
