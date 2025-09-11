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
      posts.map((post) => {
        // Debug logging
        console.log('Post data from DB:', {
          id: post.id,
          title: post.title,
          declineReason: post.declineReason,
          hasDeclineReason: 'declineReason' in post
        });
        
        return {
          id: Number(post.id), // Ensure ID is number
          title: post.title,
          content: post.content,
          published: post.published,
          declineReason: post.declineReason, // Explicitly include declineReason
          createdAt: post.createdAt.toISOString(),        author: {
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
        };
      })
    );

    // ✅ NO server-side caching headers - SWR handles all caching!
    // Let SWR decide when to cache, revalidate, dedupe, etc.

    return NextResponse.json(
      posts.map((post) => {
        // Debug logging
        console.log('Post data from DB:', {
          id: post.id,
          title: post.title,
          declineReason: post.declineReason,
          hasDeclineReason: 'declineReason' in post
        });
        
        return {
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
        };
      })
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 },
    );
  }
}
