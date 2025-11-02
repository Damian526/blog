'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { checkRateLimit, rateLimitConfigs } from '@/lib/ratelimit';

// Validation schemas
const createCommentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment is too long (maximum 2000 characters)')
    .trim(),
  postId: z.number().positive('Invalid post ID'),
  parentId: z.number().positive('Invalid parent comment ID').optional(),
});

const updateCommentSchema = z.object({
  commentId: z.number().positive('Invalid comment ID'),
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment is too long (maximum 2000 characters)')
    .trim(),
});

const deleteCommentSchema = z.number().positive('Invalid comment ID');

/**
 * Server Action: Create a new comment
 * Used in forms for adding comments to posts
 */
export async function createComment(formData: {
  content: string;
  postId: number;
  parentId?: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return { success: false, error: 'You must be logged in to comment' };
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(
      session.user.email,
      rateLimitConfigs.createComment
    );
    if (!rateLimitResult.success) {
      return { success: false, error: rateLimitResult.error };
    }

    // Validate input
    const validationResult = createCommentSchema.safeParse(formData);
    if (!validationResult.success) {
      return { 
        success: false, 
        error: validationResult.error.issues[0].message 
      };
    }

    const { content, postId, parentId } = validationResult.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        author: { connect: { id: user.id } },
        ...(parentId && { parent: { connect: { id: parentId } } }),
      },
    });

    // Revalidate related pages
    revalidatePath(`/posts/${postId}`);
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error creating comment:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return { success: false, error: 'Post or parent comment not found' };
      }
      if (error.code === 'P2003') {
        return { success: false, error: 'Invalid post or parent comment reference' };
      }
    }
    
    return { 
      success: false, 
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'Failed to create comment' 
    };
  }
}

/**
 * Server Action: Update a comment
 * Used in forms for editing comments
 */
export async function updateComment(
  commentId: number,
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const validationResult = updateCommentSchema.safeParse({ commentId, content });
    if (!validationResult.success) {
      return { 
        success: false, 
        error: validationResult.error.issues[0].message 
      };
    }

    const { content: validatedContent } = validationResult.data;

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return { success: false, error: 'You must be logged in to edit comments' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if user owns the comment
    const existingComment = await prisma.comment.findFirst({
      where: { id: commentId, authorId: user.id },
      include: { post: { select: { id: true } } },
    });

    if (!existingComment) {
      return { success: false, error: 'Comment not found or access denied' };
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: { content: validatedContent },
    });

    // Revalidate related pages
    revalidatePath(`/posts/${existingComment.post.id}`);
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error updating comment:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return { success: false, error: 'Comment not found' };
      }
    }
    
    return { 
      success: false, 
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'Failed to update comment' 
    };
  }
}

/**
 * Server Action: Delete a comment
 * Used in forms for deleting comments
 */
export async function deleteComment(commentId: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const validationResult = deleteCommentSchema.safeParse(commentId);
    if (!validationResult.success) {
      return { 
        success: false, 
        error: validationResult.error.issues[0].message 
      };
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return { success: false, error: 'You must be logged in to delete comments' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if user owns the comment or is admin
    const existingComment = await prisma.comment.findFirst({
      where: { 
        id: commentId, 
        OR: [
          { authorId: user.id },
          { post: { author: { role: 'ADMIN' } } } // Allow post authors and admins to delete
        ]
      },
      include: { post: { select: { id: true } } },
    });

    if (!existingComment) {
      return { success: false, error: 'Comment not found or access denied' };
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    // Revalidate related pages
    revalidatePath(`/posts/${existingComment.post.id}`);
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return { success: false, error: 'Comment not found' };
      }
      if (error.code === 'P2003') {
        return { success: false, error: 'Cannot delete comment with replies' };
      }
    }
    
    return { 
      success: false, 
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'Failed to delete comment' 
    };
  }
}

