import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// DELETE /api/admin/users/[id] - Delete a user
export async function DELETE(
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

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (currentUser?.id === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete user and all related data (use transaction for safety)
    await prisma.$transaction(async (tx) => {
      // First, delete all comments by this user
      await tx.comment.deleteMany({
        where: { authorId: userId },
      });

      // Then, delete all discussions by this user
      await tx.discussion.deleteMany({
        where: { authorId: userId },
      });

      // Then, delete all posts by this user
      await tx.post.deleteMany({
        where: { authorId: userId },
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
