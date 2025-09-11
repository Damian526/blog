'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Server Action: Publish a post (Admin only)
 * Used in admin forms for approving posts
 */
export async function publishPost(postId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Access denied' };
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return { success: false, error: 'Post not found' };
    }

    await prisma.post.update({
      where: { id: postId },
      data: { 
        published: true,
        declineReason: null // Clear any previous decline reason
      },
    });

    // Revalidate related pages
    revalidatePath('/admin');
    revalidatePath('/dashboard');
    revalidatePath('/');
    revalidatePath(`/posts/${postId}`);

    return { success: true };
  } catch (error) {
    console.error('Error publishing post:', error);
    return { success: false, error: 'Internal server error' };
  }
}

/**
 * Server Action: Reject a post (Admin only)
 * Used in admin forms for rejecting posts
 */
export async function rejectPost(
  postId: number, 
  declineReason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Access denied' };
    }

    if (!declineReason?.trim()) {
      return { success: false, error: 'Decline reason is required' };
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return { success: false, error: 'Post not found' };
    }

    await prisma.post.update({
      where: { id: postId },
      data: { 
        published: false,
        declineReason: declineReason.trim()
      },
    });

    // Revalidate related pages
    revalidatePath('/admin');
    revalidatePath('/dashboard');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error rejecting post:', error);
    return { success: false, error: 'Internal server error' };
  }
}

/**
 * Server Action: Update user role (Admin only)
 * Used in admin forms for changing user permissions
 */
export async function updateUserRole(
  userId: number,
  role: 'USER' | 'ADMIN'
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Access denied' };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    // Revalidate admin pages
    revalidatePath('/admin');
    revalidatePath('/admin/users');

    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: 'Internal server error' };
  }
}

/**
 * Server Action: Delete user (Admin only)
 * Used in admin forms for removing users
 */
export async function deleteUser(userId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Access denied' };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Prevent admin from deleting themselves
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (currentUser?.id === userId) {
      return { success: false, error: 'Cannot delete your own account' };
    }

    // Delete user and cascade delete their posts/comments
    await prisma.user.delete({
      where: { id: userId },
    });

    // Revalidate admin pages
    revalidatePath('/admin');
    revalidatePath('/admin/users');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Internal server error' };
  }
}
