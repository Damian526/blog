import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all users for admin
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        verified: true,
        role: true,
        isExpert: true,
        verificationReason: true,
        portfolioUrl: true,
        approvedBy: true,
        approvedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format the response to ensure consistent data types
    const formattedUsers = users.map((user) => ({
      id: Number(user.id),
      name: user.name || '',
      email: user.email,
      image: null, // Admin endpoint doesn't return profilePicture, but Zod schema expects image
      role: user.role,
      verified: user.verified || false,
      isExpert: user.isExpert || false,
      verificationReason: user.verificationReason,
      portfolioUrl: user.portfolioUrl,
      approvedBy: user.approvedBy ? Number(user.approvedBy) : null,
      approvedAt: user.approvedAt ? user.approvedAt.toISOString() : null,
      createdAt: user.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedUsers); // Return array directly, not wrapped in object
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    );
  }
}

// PUT - Update user verified status
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { userId, action } = await request.json();

    const updateData: {
      approvedBy: number;
      approvedAt: Date;
      verified?: boolean;
      isExpert?: boolean;
      verificationReason?: string | null;
      portfolioUrl?: string | null;
    } = {
      approvedBy: adminUser.id,
      approvedAt: new Date(),
    };

    if (action === 'approve') {
      updateData.verified = true;
      updateData.isExpert = false;
    } else if (action === 'verify') {
      updateData.verified = true;
      updateData.isExpert = true;
    } else if (action === 'reject') {
      updateData.verified = false;
      updateData.isExpert = false;
      updateData.verificationReason = null;
      updateData.portfolioUrl = null;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        verified: true,
        role: true,
        isExpert: true,
        verificationReason: true,
        portfolioUrl: true,
        approvedBy: true,
        approvedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 },
    );
  }
}
