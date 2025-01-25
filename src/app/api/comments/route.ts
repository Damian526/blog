import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure you have your Prisma client setup
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Ensure your NextAuth config is set up

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { content, postId } = await request.json();

    // Validate input
    if (!content || !postId) {
      return NextResponse.json(
        { error: 'Content and postId are required' },
        { status: 400 },
      );
    }

    // Get the logged-in user's session
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'You must be logged in to comment' },
        { status: 401 },
      );
    }

    // Find the logged-in user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create the comment
    const newComment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } }, // Connect to the post
        author: { connect: { id: user.id } }, // Connect to the logged-in user
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 },
    );
  }
}
