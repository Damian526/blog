'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Validation schemas
const postIdSchema = z.number().positive('Invalid post ID');

const rejectPostSchema = z.object({
  postId: z.number().positive('Invalid post ID'),
  declineReason: z.string()
    .min(10, 'Decline reason must be at least 10 characters')
    .max(500, 'Decline reason is too long')
    .trim(),
});

const updateUserRoleSchema = z.object({
  userId: z.number().positive('Invalid user ID'),
  role: z.enum(['USER', 'ADMIN'], {
    message: 'Role must be either USER or ADMIN'
  }),
});

const deleteUserSchema = z.number().positive('Invalid user ID');

/**
 * Server Action: Publish a post (Admin only)
 * Used in admin forms for approving posts
 */
export async function publishPost(postId: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const validationResult = postIdSchema.safeParse(postId);
    if (!validationResult.success) {
      return { 
        success: false, 
        error: validationResult.error.issues[0].message 
      };
    }

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
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return { success: false, error: 'Post not found' };
      }
    }
    
    return { 
      success: false, 
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'Internal server error' 
    };
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
    // Validate input
    const validationResult = rejectPostSchema.safeParse({ postId, declineReason });
    if (!validationResult.success) {
      return { 
        success: false, 
        error: validationResult.error.issues[0].message 
      };
    }

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Access denied' };
    }

    const { declineReason: validatedReason } = validationResult.data;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return { success: false, error: 'Post not found' };
    }

    await prisma.post.update({
      where: { id: postId },
      data: { 
        published: false,
        declineReason: validatedReason
      },
    });

    // Revalidate related pages
    revalidatePath('/admin');
    revalidatePath('/dashboard');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error rejecting post:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return { success: false, error: 'Post not found' };
      }
    }
    
    return { 
      success: false, 
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'Internal server error' 
    };
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
    // Validate input
    const validationResult = updateUserRoleSchema.safeParse({ userId, role });
    if (!validationResult.success) {
      return { 
        success: false, 
        error: validationResult.error.issues[0].message 
      };
    }

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
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return { success: false, error: 'User not found' };
      }
    }
    
    return { 
      success: false, 
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'Internal server error' 
    };
  }
}

/**
 * Server Action: Delete user (Admin only)
 * Used in admin forms for removing users
 */
export async function deleteUser(userId: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const validationResult = deleteUserSchema.safeParse(userId);
    if (!validationResult.success) {
      return { 
        success: false, 
        error: validationResult.error.issues[0].message 
      };
    }

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
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return { success: false, error: 'User not found' };
      }
      if (error.code === 'P2003') {
        return { success: false, error: 'Cannot delete user with existing posts or comments' };
      }
    }
    
    return { 
      success: false, 
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'Internal server error' 
    };
  }
}

