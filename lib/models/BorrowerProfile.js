import mongoose from 'mongoose';

const BorrowerProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    aadhaarNumber: {
        type: String,
        required: false,
        trim: true,
    },
    kycStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    riskScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 50, // Default medium risk
    },
    activeLoanCount: {
        type: Number,
        default: 0,
    },
    totalLoansCount: {
        type: Number,
        default: 0,
    },
    totalBorrowed: {
        type: Number,
        default: 0,
    },
    totalRepaid: {
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
BorrowerProfileSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.models.BorrowerProfile || mongoose.model('BorrowerProfile', BorrowerProfileSchema);
