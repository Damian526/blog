// SIMPLE EXPLANATION: API for users to request verification as experts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { UserStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const { reason, portfolioUrl } = await request.json();

    // Check if user is logged in
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is already verified
    if (user.status === UserStatus.VERIFIED) {
      return NextResponse.json({ error: 'Already verified' }, { status: 400 });
    }

    // Check if user is at least approved
    if (user.status !== UserStatus.APPROVED) {
      return NextResponse.json(
        {
          error: 'Must be approved community member first',
        },
        { status: 400 },
      );
    }

    // Basic validation
    if (!reason || reason.length < 20) {
      return NextResponse.json(
        {
          error: 'Please provide a detailed reason (min 20 characters)',
        },
        { status: 400 },
      );
    }

    // Update user with verification request
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationReason: reason,
        portfolioUrl: portfolioUrl || null,
      },
      select: {
        id: true,
        name: true,
        status: true,
        verificationReason: true,
        portfolioUrl: true,
      },
    });

    return NextResponse.json({
      message: 'Verification request submitted successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error submitting verification request:', error);
    return NextResponse.json(
      {
        error: 'Failed to submit verification request',
      },
      { status: 500 },
    );
  }
}
