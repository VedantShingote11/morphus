import { requireRole } from '@/lib/auth/middleware';
import BorrowerProfile from '@/lib/models/BorrowerProfile';
import LenderProfile from '@/lib/models/LenderProfile';
import User from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const authCheck = requireRole(request, ['admin']);
    if (!authCheck.authorized) return authCheck.response;

    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');

        const query = {};
        if (role && role !== 'all') {
            query.role = role;
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });

        // Enrich with profiles
        const enrichedUsers = await Promise.all(
            users.map(async (user) => {
                let profile = null;

                if (user.role === 'borrower') {
                    profile = await BorrowerProfile.findOne({ userId: user._id });
                } else if (user.role === 'lender') {
                    profile = await LenderProfile.findOne({ userId: user._id });
                }

                return {
                    ...user.toObject(),
                    profile: profile ? profile.toObject() : null,
                };
            })
        );

        return NextResponse.json({
            success: true,
            users: enrichedUsers,
        });

    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
