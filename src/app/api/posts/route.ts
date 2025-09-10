import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url, 'http://localhost');
    const catParam = url.searchParams.get('categoryIds');
    const subParam = url.searchParams.get('subcategoryIds');
    const publishedParam = url.searchParams.get('published');
    const authorIdParam = url.searchParams.get('authorId');

    const whereClauses: any[] = [];

    if (catParam) {
      const catIds = catParam
        .split(',')
        .map(Number)
        .filter((n) => !isNaN(n));
      whereClauses.push({
        subcategories: { some: { categoryId: { in: catIds } } },
      });
    }

    if (subParam) {
      const subIds = subParam
        .split(',')
        .map(Number)
        .filter((n) => !isNaN(n));
      whereClauses.push({
        subcategories: { some: { id: { in: subIds } } },
      });
    }

    // Build the base where clause
    let where: any = {};
    
    // Handle category/subcategory filters (OR condition)
    if (whereClauses.length > 0) {
      where.OR = whereClauses;
    }

    // Handle published filter (AND condition)
    if (publishedParam !== null) {
      where.published = publishedParam === 'true';
    }

    // Handle author filter (AND condition)
    if (authorIdParam) {
      const authorId = Number(authorIdParam);
      if (!isNaN(authorId)) {
        where.authorId = authorId;
      }
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

    const response = NextResponse.json(
      posts.map((post) => ({
        id: Number(post.id), // Ensure ID is number
        title: post.title,
        content: post.content,
        published: post.published,
        declineReason: post.declineReason, // Explicitly include declineReason
        createdAt: post.createdAt.toISOString(),
        author: {
          id: Number(post.author.id), // Ensure author ID is number
          name: post.author.name || null, // Handle null names
          email: post.author.email,
          image: post.author.profilePicture || null, // Map profilePicture to image, handle null
          createdAt: post.author.createdAt.toISOString(),
        },
        subcategories: post.subcategories.map(subcat => ({
          ...subcat,
          id: Number(subcat.id), // Ensure subcategory ID is number
          categoryId: Number(subcat.categoryId), // Ensure category ID is number
          category: subcat.category ? {
            ...subcat.category,
            id: Number(subcat.category.id), // Ensure category ID is number
          } : undefined,
        })),
        _count: post._count,
      })),
    );

    // Set appropriate cache headers based on request
    if (authorIdParam) {
      // User-specific data - no cache
      response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    } else {
      // Public data - cache for 15 minutes
      response.headers.set('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=1800');
    }

    return response;
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

    // Expect title, content, and subcategoryIds from the request body
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

    const post = await prisma.post.create({        data: {
          title,
          content,
          published: false,
          declineReason: null,
          createdAt: new Date(),
          authorId: user.id,
          // Connect one or more subcategories only
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

    // Format the response to match our Zod schema
    const formattedPost = {
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

    return NextResponse.json(formattedPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post with subcategories:', error);
    return NextResponse.json(
      { error: 'Failed to create post.' },
      { status: 500 },
    );
  }
}
