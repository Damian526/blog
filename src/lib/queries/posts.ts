import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { PostSummary } from '@/server/api/types';

/**
 * SSR Query: Fetch user's dashboard posts (published and unpublished)
 * Used for server-side rendering of dashboard page
 */
export async function getDashboardPosts(): Promise<PostSummary[]> {
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
    console.error('Error fetching dashboard posts:', error);
    return [];
  }
}

/**
 * SSR Query: Fetch published posts for main page
 * Used for server-side rendering of home page
 */
export async function getPublishedPosts(options?: {
  categoryIds?: number[];
  subcategoryIds?: number[];
}): Promise<PostSummary[]> {
  try {
    const whereClauses: any[] = [];

    // Handle category filter
    if (options?.categoryIds?.length) {
      whereClauses.push({
        subcategories: { some: { categoryId: { in: options.categoryIds } } },
      });
    }

    // Handle subcategory filter
    if (options?.subcategoryIds?.length) {
      whereClauses.push({
        subcategories: { some: { id: { in: options.subcategoryIds } } },
      });
    }

    // Build the base where clause
    let where: any = { published: true };
    
    // Handle category/subcategory filters (OR condition)
    if (whereClauses.length > 0) {
      where.OR = whereClauses;
    }

    const posts = await prisma.post.findMany({
      where,
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
    console.error('Error fetching published posts:', error);
    return [];
  }
}

/**
 * SSR Query: Fetch single post by ID
 * Used for server-side rendering of individual post pages
 */
export async function getPostById(id: number): Promise<PostSummary | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
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
    });

    if (!post) {
      return null;
    }

    // Format the response to match PostSummary type
    return {
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

  } catch (error) {
    console.error('Error fetching post by ID:', error);
    return null;
  }
}