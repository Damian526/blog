'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { PostSummary } from '@/server/api/types';

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

    const { title, content, subcategoryIds } = formData;

    if (!title || !content) {
      return { success: false, error: 'Title and Content are required.' };
    }

    if (!Array.isArray(subcategoryIds) || subcategoryIds.length === 0) {
      return { success: false, error: 'At least one subcategory is required.' };
    }

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
      id: Number(post.id),
      title: post.title,
      content: post.content,
      published: post.published,
      declineReason: post.declineReason,
      createdAt: post.createdAt.toISOString(),
      author: {
        id: Number(post.author.id),
        name: post.author.name,
        email: post.author.email,
        image: post.author.profilePicture || null,
        createdAt: post.author.createdAt.toISOString(),
      },
      subcategories: post.subcategories.map(subcat => ({
        id: Number(subcat.id),
        name: subcat.name,
        categoryId: Number(subcat.categoryId),
        category: subcat.category ? {
          id: Number(subcat.category.id),
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
    return { success: false, error: 'Failed to create post.' };
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

    const { title, content, subcategoryIds } = formData;

    if (!title || !content) {
      return { success: false, error: 'Title and Content are required.' };
    }

    if (!Array.isArray(subcategoryIds) || subcategoryIds.length === 0) {
      return { success: false, error: 'At least one subcategory is required.' };
    }

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
      id: Number(post.id),
      title: post.title,
      content: post.content,
      published: post.published,
      declineReason: post.declineReason,
      createdAt: post.createdAt.toISOString(),
      author: {
        id: Number(post.author.id),
        name: post.author.name,
        email: post.author.email,
        image: post.author.profilePicture || null,
        createdAt: post.author.createdAt.toISOString(),
      },
      subcategories: post.subcategories.map(subcat => ({
        id: Number(subcat.id),
        name: subcat.name,
        categoryId: Number(subcat.categoryId),
        category: subcat.category ? {
          id: Number(subcat.category.id),
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
    return { success: false, error: 'Failed to update post.' };
  }
}

/**
 * Server Action: Delete a post
 * Used in forms for deleting posts
 */
export async function deletePost(postId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: 'Unauthorized' };
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
    return { success: false, error: 'Failed to delete post.' };
  }
}
