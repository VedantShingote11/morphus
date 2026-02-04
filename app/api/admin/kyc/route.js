import { requireRole } from '@/lib/auth/middleware';
import BorrowerProfile from '@/lib/models/BorrowerProfile';
import dbConnect from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const authCheck = requireRole(request, ['admin']);
    if (!authCheck.authorized) return authCheck.response;

    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const query = {};
        if (status) {
            query.kycStatus = status;
        }

        const profiles = await BorrowerProfile.find(query)
            .populate('userId', 'name email createdAt')
            .sort({ updatedAt: -1 });

        return NextResponse.json({
            success: true,
            kycRequests: profiles,
        });

    } catch (error) {
        console.error('Get KYC requests error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch KYC requests' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    const authCheck = requireRole(request, ['admin']);
    if (!authCheck.authorized) return authCheck.response;

    try {
        await dbConnect();

        const { profileId, status } = await request.json();

        if (!profileId || !status) {
            return NextResponse.json(
                { error: 'Profile ID and status are required' },
                { status: 400 }
            );
        }

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be approved or rejected' },
                { status: 400 }
            );
        }

        const profile = await BorrowerProfile.findById(profileId);

        if (!profile) {
            return NextResponse.json(
                { error: 'Profile not found' },
                { status: 404 }
            );
        }

        profile.kycStatus = status;
        await profile.save();

        return NextResponse.json({
            success: true,
            message: `KYC ${status} successfully`,
            profile: profile.toObject(),
        });

    } catch (error) {
        console.error('Update KYC error:', error);
        return NextResponse.json(
            { error: 'Failed to update KYC status' },
            { status: 500 }
        );
    }
}
