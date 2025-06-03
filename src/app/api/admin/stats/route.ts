import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { userPermissions } from '@/lib/permissions';

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

    // Get user statistics
    const totalUsers = await prisma.user.count();

    const pendingUsers = await prisma.user.count({
      where: { status: 'PENDING' },
    });

    const pendingApplications = await prisma.user.count({
      where: {
        AND: [
          { verificationReason: { not: null } },
          { status: { not: 'VERIFIED' } },
        ],
      },
    });

    return NextResponse.json({
      users: {
        total: totalUsers,
        pending: pendingUsers,
        applications: pendingApplications,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 },
    );
  }
}
