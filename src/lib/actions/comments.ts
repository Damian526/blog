'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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
    const { content, postId, parentId } = formData;

    if (!content || !postId) {
      return { success: false, error: 'Content and postId are required' };
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return { success: false, error: 'You must be logged in to comment' };
    }

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
    return { success: false, error: 'Failed to create comment' };
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
    if (!content?.trim()) {
      return { success: false, error: 'Content is required' };
    }

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
      data: { content: content.trim() },
    });

    // Revalidate related pages
    revalidatePath(`/posts/${existingComment.post.id}`);
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error updating comment:', error);
    return { success: false, error: 'Failed to update comment' };
  }
}

/**
 * Server Action: Delete a comment
 * Used in forms for deleting comments
 */
export async function deleteComment(commentId: number): Promise<{ success: boolean; error?: string }> {
  try {
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
    return { success: false, error: 'Failed to delete comment' };
  }
}
