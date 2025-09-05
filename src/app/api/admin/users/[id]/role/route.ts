import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// PATCH /api/admin/users/[id]/role - Update user role
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id, 10);
    const { role } = await request.json();

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    if (!role || !['ADMIN', 'USER'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be ADMIN or USER' },
        { status: 400 }
      );
    }

    // Prevent admin from changing their own role
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (currentUser?.id === userId) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 400 }
      );
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verified: true,
        isExpert: true,
        profilePicture: true,
        createdAt: true,
      },
    });

    // Format response to match UserSchema
    const formattedUser = {
      id: Number(updatedUser.id),
      name: updatedUser.name || '',
      email: updatedUser.email,
      image: updatedUser.profilePicture,
      profilePicture: updatedUser.profilePicture,
      role: updatedUser.role,
      verified: updatedUser.verified,
      isExpert: updatedUser.isExpert,
      createdAt: updatedUser.createdAt.toISOString(),
    };

    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
