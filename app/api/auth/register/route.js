import { generateToken } from '@/lib/auth/jwt';
import BorrowerProfile from '@/lib/models/BorrowerProfile';
import LenderProfile from '@/lib/models/LenderProfile';
import User from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await dbConnect();

        const { email, password, name, role } = await request.json();

        // Validation
        if (!email || !password || !name || !role) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (!['borrower', 'lender', 'admin'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
            role,
        });

        await user.save();

        // Create role-specific profile
        if (role === 'borrower') {
            const borrowerProfile = new BorrowerProfile({
                userId: user._id,
            });
            await borrowerProfile.save();
        } else if (role === 'lender') {
            const lenderProfile = new LenderProfile({
                userId: user._id,
            });
            await lenderProfile.save();
        }

        // Generate JWT token
        const token = generateToken(user._id.toString(), user.role, user.email, user.name);

        return NextResponse.json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed. Please try again.' },
            { status: 500 }
        );
    }
}
