import { requireRole } from '@/lib/auth/middleware';
import BorrowerProfile from '@/lib/models/BorrowerProfile';
import User from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';
import { calculateRiskScore } from '@/lib/riskEngine';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const authCheck = requireRole(request, ['borrower']);
    if (!authCheck.authorized) return authCheck.response;

    try {
        await dbConnect();

        const { user } = authCheck;

        const profile = await BorrowerProfile.findOne({ userId: user.userId });
        const userDetails = await User.findById(user.userId).select('-password');

        if (!profile) {
            return NextResponse.json(
                { error: 'Profile not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            profile: {
                ...profile.toObject(),
                user: userDetails,
            },
        });

    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    const authCheck = requireRole(request, ['borrower']);
    if (!authCheck.authorized) return authCheck.response;

    try {
        await dbConnect();

        const { user } = authCheck;
        const { aadhaarNumber } = await request.json();

        const profile = await BorrowerProfile.findOne({ userId: user.userId });

        if (!profile) {
            return NextResponse.json(
                { error: 'Profile not found' },
                { status: 404 }
            );
        }

        // Update Aadhaar and set KYC to pending
        if (aadhaarNumber) {
            profile.aadhaarNumber = aadhaarNumber;
            profile.kycStatus = 'pending';
        }

        // Recalculate risk score
        const riskScore = await calculateRiskScore(profile, user.userId);
        profile.riskScore = riskScore;

        await profile.save();

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            profile: profile.toObject(),
        });

    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
