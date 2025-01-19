import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/'); // Split the path by "/"
    const id = pathSegments[pathSegments.length - 1]; // Get the last segment, which is the `id`

    if (!id || isNaN(parseInt(id, 10))) {
      return NextResponse.json(
        { error: 'Invalid or missing post ID' },
        { status: 400 },
      );
    }

    const postId = parseInt(id, 10);

    // Fetch the post from the database
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: { select: { name: true } } }, // Include author details
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Return the post data
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
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

    // Parse the request body for fields to update
    const { title, content } = await request.json();

    // If no fields were provided, return an error
    if (title === undefined && content === undefined) {
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

    // Perform a partial update: update only provided fields
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
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
