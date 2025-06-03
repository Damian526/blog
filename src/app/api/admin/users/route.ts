import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { userPermissions } from '@/lib/permissions';
import { UserStatus } from '@prisma/client';

// GET - List users for admin
export async function GET() {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!userPermissions.canApproveUsers(currentUser)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Get all users with basic info
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        isExpert: true,
        role: true,
        createdAt: true,
        approvedAt: true,
        verificationReason: true,
        portfolioUrl: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    );
  }
}

// PUT - Update user status
export async function PUT(request: Request) {
  try {
    const { userId, action } = await request.json();

    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!userPermissions.canApproveUsers(currentUser)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Perform the action
    let updateData: any = {
      approvedBy: currentUser!.id,
      approvedAt: new Date(),
    };

    switch (action) {
      case 'approve':
        updateData.status = UserStatus.APPROVED;
        break;
      case 'verify':
        updateData.status = UserStatus.VERIFIED;
        updateData.isExpert = true;
        break;
      case 'reject':
        updateData.status = UserStatus.PENDING;
        updateData.isExpert = false;
        updateData.verificationReason = null;
        updateData.portfolioUrl = null;
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        isExpert: true,
        role: true,
        verificationReason: true,
        portfolioUrl: true,
      },
    });

    return NextResponse.json({
      user: updatedUser,
      message: `User ${action}d successfully`,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 },
    );
  }
}
