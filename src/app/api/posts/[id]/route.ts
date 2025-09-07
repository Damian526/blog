import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const post = await prismaClient.post.findUnique({
      where: { id: postId },
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
            category: { 
              select: { id: true, name: true } 
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Format the response to match our schema
    const formattedPost = {
      id: Number(post.id),
      title: post.title,
      content: post.content || '',
      published: post.published,
      authorId: Number(post.authorId),
      createdAt: post.createdAt.toISOString(),
      declineReason: post.declineReason || null,
      author: post.author ? {
        id: Number(post.author.id),
        name: post.author.name,
        email: post.author.email,
        image: post.author.profilePicture || null,
        createdAt: post.author.createdAt.toISOString(),
      } : null,
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

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // Extract the post ID from the URL path
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    // Validate the post ID
    if (!id || isNaN(parseInt(id, 10))) {
      return NextResponse.json(
        { error: 'Invalid or missing post ID' },
        { status: 400 },
      );
    }

    const postId = parseInt(id, 10);

    // Parse the request body for fields to update.
    // We only accept title, content, and optionally subcategoryIds.
    const { title, content, subcategoryIds } = await request.json();

    if (
      title === undefined &&
      content === undefined &&
      subcategoryIds === undefined
    ) {
      return NextResponse.json(
        { error: 'No fields provided for update.' },
        { status: 400 },
      );
    }

    // Check if the post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Build update data. Use "set" for many-to-many relationships.
    const updateData: any = {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(Array.isArray(subcategoryIds) &&
        subcategoryIds.length > 0 && {
          subcategories: { set: subcategoryIds.map((id: number) => ({ id })) },
        }),
    };

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updateData,
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
            category: { 
              select: { id: true, name: true } 
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    // Format the response to match our schema
    const formattedPost = {
      id: Number(updatedPost.id),
      title: updatedPost.title,
      content: updatedPost.content,
      published: updatedPost.published,
      declineReason: updatedPost.declineReason || null,
      createdAt: updatedPost.createdAt.toISOString(),
      authorId: Number(updatedPost.authorId),
      author: {
        id: Number(updatedPost.author.id),
        name: updatedPost.author.name,
        email: updatedPost.author.email,
        image: updatedPost.author.profilePicture || null,
        createdAt: updatedPost.author.createdAt.toISOString(),
      },
      subcategories: updatedPost.subcategories.map(subcat => ({
        id: Number(subcat.id),
        name: subcat.name,
        categoryId: Number(subcat.categoryId),
        category: subcat.category ? {
          id: Number(subcat.category.id),
          name: subcat.category.name,
        } : undefined,
      })),
      _count: updatedPost._count,
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Extract the post ID from the URL path
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id || isNaN(parseInt(id, 10))) {
      return NextResponse.json(
        { error: 'Invalid or missing post ID' },
        { status: 400 },
      );
    }

    const postId = parseInt(id, 10);

    // Check if the post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Delete the post
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json(
      { message: `Post with ID ${postId} has been deleted.` },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 },
    );
  }
}
