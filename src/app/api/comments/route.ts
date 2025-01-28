import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { content, postId } = await request.json();

    if (!content || !postId) {
      return NextResponse.json(
        { error: 'Content and postId are required' },
        { status: 400 },
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to comment' },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        author: { connect: { id: user.id } },
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');

    if (!postId || isNaN(parseInt(postId, 10))) {
      return NextResponse.json(
        { error: 'Invalid or missing postId' },
        { status: 400 },
      );
    }

    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId, 10) },
      include: { author: { select: { name: true, email: true } } },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 },
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const commentId = url.searchParams.get('commentId');

    if (!commentId || isNaN(parseInt(commentId, 10))) {
      return NextResponse.json(
        { error: 'Invalid or missing commentId' },
        { status: 400 },
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to delete a comment' },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId, 10) },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Ensure the user is the author of the comment or has admin privileges
    if (comment.authorId !== user.id) {
      return NextResponse.json(
        { error: 'You are not authorized to delete this comment' },
        { status: 403 },
      );
    }

    await prisma.comment.delete({
      where: { id: parseInt(commentId, 10) },
    });

    return NextResponse.json(
      { message: 'Comment deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 },
    );
  }
}
