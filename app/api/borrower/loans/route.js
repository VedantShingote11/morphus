import { requireRole } from '@/lib/auth/middleware';
import { createBlock } from '@/lib/blockchain';
import BorrowerProfile from '@/lib/models/BorrowerProfile';
import LoanRequest from '@/lib/models/LoanRequest';
import dbConnect from '@/lib/mongodb';
import { calculateRiskScore, suggestInterestRate } from '@/lib/riskEngine';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const authCheck = requireRole(request, ['borrower']);
    if (!authCheck.authorized) return authCheck.response;

    try {
        await dbConnect();

        const { user } = authCheck;

        const loans = await LoanRequest.find({ borrowerId: user.userId })
            .populate('fundedBy', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            loans,
        });

    } catch (error) {
        console.error('Get loans error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch loans' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    const authCheck = requireRole(request, ['borrower']);
    if (!authCheck.authorized) return authCheck.response;

    try {
        await dbConnect();

        const { user } = authCheck;
        const { amount, purpose, duration, preferredInterestRate, repaymentFrequency, description } = await request.json();

        // Validation
        if (!amount || !purpose || !duration) {
            return NextResponse.json(
                { error: 'Amount, purpose, and duration are required' },
                { status: 400 }
            );
        }

        if (amount < 1000) {
            return NextResponse.json(
                { error: 'Minimum loan amount is ₹1,000' },
                { status: 400 }
            );
        }

        // Get borrower profile
        const borrowerProfile = await BorrowerProfile.findOne({ userId: user.userId });

        if (!borrowerProfile) {
            return NextResponse.json(
                { error: 'Borrower profile not found' },
                { status: 404 }
            );
        }

        // Check KYC status
        if (borrowerProfile.kycStatus !== 'approved') {
            return NextResponse.json(
                { error: 'KYC must be approved before requesting a loan' },
                { status: 403 }
            );
        }

        // Calculate risk score
        const riskScore = await calculateRiskScore(borrowerProfile, user.userId);

        // Update borrower profile risk score
        borrowerProfile.riskScore = riskScore;
        await borrowerProfile.save();

        // Suggest interest rate
        const suggestedRate = suggestInterestRate(riskScore, amount, duration);

        // Create loan request
        const loanRequest = new LoanRequest({
            borrowerId: user.userId,
            amount,
            purpose,
            duration,
            preferredInterestRate: preferredInterestRate || suggestedRate,
            repaymentFrequency: repaymentFrequency || 'monthly',
            description,
            riskScore,
            interestRate: suggestedRate,
        });

        await loanRequest.save();

        // Update borrower profile
        borrowerProfile.totalLoansCount += 1;
        await borrowerProfile.save();

        // Create blockchain block
        await createBlock(
            'loan_created',
            user.userId,
            null,
            amount,
            {
                loanId: loanRequest._id.toString(),
                purpose,
                duration,
                interestRate: suggestedRate,
                riskScore,
            }
        );

        return NextResponse.json({
            success: true,
            message: 'Loan request created successfully',
            loan: loanRequest.toObject(),
            suggestedInterestRate: suggestedRate,
        }, { status: 201 });

    } catch (error) {
        console.error('Create loan error:', error);
        return NextResponse.json(
            { error: 'Failed to create loan request' },
            { status: 500 }
        );
    }
}
