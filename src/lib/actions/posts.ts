'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { checkRateLimit, rateLimitConfigs } from '@/lib/ratelimit';
import type { PostSummary } from '@/server/api/types';

// Validation schemas
const createPostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(50000, 'Content is too long'),
  subcategoryIds: z.array(z.number().positive())
    .min(1, 'At least one category is required')
    .max(5, 'Maximum 5 categories allowed'),
});

const updatePostSchema = createPostSchema.extend({
  postId: z.number().positive('Invalid post ID'),
});

/**
 * Server Action: Create a new post
 * Used in forms for creating posts
 */
export async function createPost(formData: {
  title: string;
  content: string;
  subcategoryIds: number[];
}): Promise<{ success: boolean; post?: PostSummary; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(
      session.user.email as string,
      rateLimitConfigs.createPost
    );
    if (!rateLimitResult.success) {
      return { success: false, error: rateLimitResult.error };
    }

    // Validate input
    const validationResult = createPostSchema.safeParse(formData);
    if (!validationResult.success) {
      return { 
        success: false, 
        error: validationResult.error.errors[0].message 
      };
    }

    const { title, content, subcategoryIds } = validationResult.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: false,
        declineReason: null,
        createdAt: new Date(),
        authorId: user.id,
        subcategories: {
          connect: subcategoryIds.map((id: number) => ({ id })),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
            createdAt: true,
          },
        },
        subcategories: {
          select: {
            id: true,
            name: true,
            categoryId: true,
            category: { select: { id: true, name: true } },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    // Format the response to match our type
    const formattedPost: PostSummary = {
      id: post.id as number,
      title: post.title,
      content: post.content,
      published: post.published,
      declineReason: post.declineReason,
      createdAt: post.createdAt.toISOString(),
      author: {
        id: post.author.id as number,
        name: post.author.name,
        email: post.author.email,
        image: post.author.profilePicture || null,
        createdAt: post.author.createdAt.toISOString(),
      },
      subcategories: post.subcategories.map(subcat => ({
        id: subcat.id as number,
        name: subcat.name,
        categoryId: subcat.categoryId as number,
        category: subcat.category ? {
          id: subcat.category.id as number,
          name: subcat.category.name,
        } : undefined,
      })),
      _count: post._count,
    };

    // Revalidate related pages
    revalidatePath('/dashboard');
    revalidatePath('/');

    return { success: true, post: formattedPost };
  } catch (error) {
    console.error('Error creating post:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, error: 'A post with this title already exists' };
      }
      if (error.code === 'P2025') {
        return { success: false, error: 'One or more categories not found' };
      }
    }
    
    return { 
      success: false, 
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'Failed to create post.' 
    };
  }
}

/**
 * Server Action: Update an existing post
 * Used in forms for editing posts
 */
export async function updatePost(
  postId: number,
  formData: {
    title: string;
    content: string;
    subcategoryIds: number[];
  }
): Promise<{ success: boolean; post?: PostSummary; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(
      session.user.email as string,
      rateLimitConfigs.updatePost
    );
    if (!rateLimitResult.success) {
      return { success: false, error: rateLimitResult.error };
    }

    // Validate input
    const validationResult = updatePostSchema.safeParse({ ...formData, postId });
    if (!validationResult.success) {
      return { 
        success: false, 
        error: validationResult.error.errors[0].message 
      };
    }

    const { title, content, subcategoryIds } = validationResult.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if user owns the post
    const existingPost = await prisma.post.findFirst({
      where: { id: postId, authorId: user.id },
    });

    if (!existingPost) {
      return { success: false, error: 'Post not found or access denied' };
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        subcategories: {
          set: [], // Disconnect all first
          connect: subcategoryIds.map((id: number) => ({ id })),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
            createdAt: true,
          },
        },
        subcategories: {
          select: {
            id: true,
            name: true,
            categoryId: true,
            category: { select: { id: true, name: true } },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    // Format the response to match our type
    const formattedPost: PostSummary = {
      id: post.id as number,
      title: post.title,
      content: post.content,
      published: post.published,
      declineReason: post.declineReason,
      createdAt: post.createdAt.toISOString(),
      author: {
        id: post.author.id as number,
        name: post.author.name,
        email: post.author.email,
        image: post.author.profilePicture || null,
        createdAt: post.author.createdAt.toISOString(),
      },
      subcategories: post.subcategories.map(subcat => ({
        id: subcat.id as number,
        name: subcat.name,
        categoryId: subcat.categoryId as number,
        category: subcat.category ? {
          id: subcat.category.id as number,
          name: subcat.category.name,
        } : undefined,
      })),
      _count: post._count,
    };

    // Revalidate related pages
    revalidatePath('/dashboard');
    revalidatePath('/');
    revalidatePath(`/posts/${postId}`);

    return { success: true, post: formattedPost };
  } catch (error) {
    console.error('Error updating post:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return { success: false, error: 'Post not found' };
      }
      if (error.code === 'P2002') {
        return { success: false, error: 'A post with this title already exists' };
      }
    }
    
    return { 
      success: false, 
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'Failed to update post.' 
    };
  }
}

/**
 * Server Action: Delete a post
 * Used in forms for deleting posts
 */
export async function deletePost(postId: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const postIdSchema = z.number().positive('Invalid post ID');
    const validationResult = postIdSchema.safeParse(postId);
    
    if (!validationResult.success) {
      return { 
        success: false, 
        error: validationResult.error.errors[0].message 
      };
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(
      session.user.email as string,
      rateLimitConfigs.deletePost
    );
    if (!rateLimitResult.success) {
      return { success: false, error: rateLimitResult.error };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if user owns the post or is admin
    const existingPost = await prisma.post.findFirst({
      where: { 
        id: postId, 
        OR: [
          { authorId: user.id },
          { author: { role: 'ADMIN' } } // Allow admins to delete any post
        ]
      },
    });

    if (!existingPost) {
      return { success: false, error: 'Post not found or access denied' };
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    // Revalidate related pages
    revalidatePath('/dashboard');
    revalidatePath('/');
    revalidatePath('/admin');

    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return { success: false, error: 'Post not found' };
      }
      if (error.code === 'P2003') {
        return { success: false, error: 'Cannot delete post with existing comments' };
      }
    }
    
    return { 
      success: false, 
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'Failed to delete post.' 
    };
  }
}

