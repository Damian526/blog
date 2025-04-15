import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
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
        // Only subcategories are included now.
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
        subcategories: {
          select: {
            id: true,
            name: true,
            category: { select: { id: true, name: true } },
          },
        },
      },
    });

    return NextResponse.json(updatedPost);
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
