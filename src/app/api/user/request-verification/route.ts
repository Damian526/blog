// SIMPLE EXPLANATION: API for users to request verification as experts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.verified) {
      return NextResponse.json({ error: 'Already verified' }, { status: 400 });
    }

    if (user.verificationReason) {
      return NextResponse.json(
        { error: 'Verification request already pending' },
        { status: 400 },
      );
    }

    const { reason, portfolioUrl } = await request.json();

    if (!reason) {
      return NextResponse.json(
        { error: 'Verification reason is required' },
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
        email: true,
        verified: true,
        isExpert: true,
        verificationReason: true,
        portfolioUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: 'Verification request submitted successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Failed to submit verification request:', error);
    return NextResponse.json(
      { error: 'Failed to submit verification request' },
      { status: 500 },
    );
  }
}
