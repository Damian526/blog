import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userPosts = await prisma.post.findMany({
      where: { author: { email: session.user.email } },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        published: true,
        declineReason: true,
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
      },
    });

    // Format the response to ensure consistent data types
    const formattedPosts = userPosts.map((post) => ({
      ...post,
      id: Number(post.id),
      createdAt: post.createdAt.toISOString(),
      author: {
        id: Number(post.author.id),
        name: post.author.name, // name is required in DB
        email: post.author.email,
        image: post.author.profilePicture || null,
        createdAt: post.author.createdAt.toISOString(),
      },
      subcategories: post.subcategories.map(subcat => ({
        ...subcat,
        id: Number(subcat.id),
        categoryId: Number(subcat.categoryId),
        category: subcat.category ? {
          ...subcat.category,
          id: Number(subcat.category.id),
        } : undefined,
      })),
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user posts' },
      { status: 500 },
    );
  }
}
