import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { PostSummary } from '@/server/api/types';

/**
 * Server action to fetch initial dashboard posts for SSR
 * Returns user's posts (both published and unpublished) for the dashboard
 */
export async function getInitialDashboardPosts(): Promise<PostSummary[]> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return [];
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return [];
    }

    // Fetch user's posts (both published and unpublished)
    const posts = await prisma.post.findMany({
      where: { 
        authorId: user.id 
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        declineReason: true,
        createdAt: true,
        author: { 
          select: { 
            id: true,
            name: true, 
            email: true,
            profilePicture: true,
            createdAt: true,
          } 
        },
        subcategories: {
          select: {
            id: true,
            name: true,
            categoryId: true,
            category: { 
              select: { 
                id: true, 
                name: true 
              } 
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format the response to match PostSummary type
    return posts.map((post): PostSummary => ({
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
    }));

  } catch (error) {
    console.error('Error fetching initial dashboard posts:', error);
    return [];
  }
}

/**
 * Server action to fetch initial published posts for main page SSR
 * Returns only published posts for public consumption
 */
export async function getInitialPublishedPosts(): Promise<PostSummary[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { 
        published: true 
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        declineReason: true,
        createdAt: true,
        author: { 
          select: { 
            id: true,
            name: true, 
            email: true,
            profilePicture: true,
            createdAt: true,
          } 
        },
        subcategories: {
          select: {
            id: true,
            name: true,
            categoryId: true,
            category: { 
              select: { 
                id: true, 
                name: true 
              } 
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format the response to match PostSummary type
    return posts.map((post): PostSummary => ({
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
    }));

  } catch (error) {
    console.error('Error fetching initial published posts:', error);
    return [];
  }
}
