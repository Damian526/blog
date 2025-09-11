import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * SSR Query: Get admin dashboard stats
 * Used for server-side rendering of admin dashboard
 */
export async function getAdminStats() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return null;
    }

    const [totalUsers, totalPosts, publishedPosts, pendingPosts] =
      await Promise.all([
        prisma.user.count(),
        prisma.post.count(),
        prisma.post.count({ where: { published: true } }),
        prisma.post.count({ where: { published: false, declineReason: null } }),
      ]);

    return {
      totalUsers,
      totalPosts,
      publishedPosts,
      pendingPosts,
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return null;
  }
}

/**
 * SSR Query: Get all users for admin management
 * Used for server-side rendering of admin users page
 */
export async function getAdminUsers() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return [];
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verified: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map((user) => ({
      id: Number(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
      createdAt: user.createdAt.toISOString(),
      _count: user._count,
    }));
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
}

/**
 * SSR Query: Get pending posts for admin review
 * Used for server-side rendering of admin posts page
 */
export async function getPendingPosts() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return [];
    }

    const posts = await prisma.post.findMany({
      where: {
        published: false,
        declineReason: null, // Only get posts that haven't been rejected
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
          },
        },
        subcategories: {
          select: {
            id: true,
            name: true,
            categoryId: true,
            category: {
              select: {
                id: true,
                name: true,
              },
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
        createdAt: 'desc',
      },
    });

    return posts.map((post) => ({
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
      subcategories: post.subcategories.map((subcat) => ({
        id: Number(subcat.id),
        name: subcat.name,
        categoryId: Number(subcat.categoryId),
        category: subcat.category
          ? {
              id: Number(subcat.category.id),
              name: subcat.category.name,
            }
          : undefined,
      })),
      _count: post._count,
    }));
  } catch (error) {
    console.error('Error fetching pending posts:', error);
    return [];
  }
}
