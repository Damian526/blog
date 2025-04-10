import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        subcategories: {
          select: {
            id: true,
            name: true,
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
    const formattedPosts = posts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
    }));
    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, subcategoryIds } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and Content are required.' },
        { status: 400 },
      );
    }

    if (!Array.isArray(subcategoryIds) || subcategoryIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one subcategory is required.' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: false,
        createdAt: new Date(),
        authorId: user.id,
        subcategories: {
          connect: subcategoryIds.map((id: number) => ({ id })),
        },
      },
      include: {
        subcategories: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post with subcategories:', error);
    return NextResponse.json(
      { error: 'Failed to create post.' },
      { status: 500 },
    );
  }
}
