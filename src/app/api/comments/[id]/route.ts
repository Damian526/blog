import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

// PATCH /api/comments/[id] - Update a comment
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { content } = await request.json();
    const resolvedParams = await params;
    const commentId = parseInt(resolvedParams.id, 10);

    if (!content || isNaN(commentId)) {
      return NextResponse.json(
        { error: 'Invalid or missing content or comment ID' },
        { status: 400 },
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to edit a comment' },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Ensure the user is the author of the comment
    if (existingComment.authorId !== user.id) {
      return NextResponse.json(
        { error: 'You are not authorized to edit this comment' },
        { status: 403 },
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
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
      },
    });

    // Format the response to match our Zod schema
    const formattedComment = {
      id: Number(updatedComment.id),
      content: updatedComment.content,
      postId: updatedComment.postId ? Number(updatedComment.postId) : null,
      discussionId: updatedComment.discussionId ? Number(updatedComment.discussionId) : null,
      parentId: updatedComment.parentId ? Number(updatedComment.parentId) : null,
      authorId: Number(updatedComment.authorId),
      createdAt: updatedComment.createdAt.toISOString(),
      author: {
        id: Number(updatedComment.author.id),
        name: updatedComment.author.name, // name is required in DB
        email: updatedComment.author.email,
        image: updatedComment.author.profilePicture || null,
        createdAt: updatedComment.author.createdAt.toISOString(),
      },
    };

    // Invalidate cache for this comment and post comments
    revalidateTag(`comment-${commentId}`);
    if (updatedComment.postId) {
      revalidateTag(`post-${updatedComment.postId}-comments`);
    }
    revalidateTag('comments');

    return NextResponse.json(formattedComment, { status: 200 });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 },
    );
  }
}

// GET /api/comments/[id] - Get a specific comment
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const commentId = parseInt(resolvedParams.id, 10);

    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 },
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
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
        replies: {
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
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Format the response to match our Zod schema
    const formattedComment = {
      id: Number(comment.id),
      content: comment.content,
      postId: comment.postId ? Number(comment.postId) : null,
      discussionId: comment.discussionId ? Number(comment.discussionId) : null,
      parentId: comment.parentId ? Number(comment.parentId) : null,
      authorId: Number(comment.authorId),
      createdAt: comment.createdAt.toISOString(),
      author: {
        id: Number(comment.author.id),
        name: comment.author.name, // name is required in DB
        email: comment.author.email,
        image: comment.author.profilePicture || null,
        createdAt: comment.author.createdAt.toISOString(),
      },
      replies: comment.replies.map((reply) => ({
        id: Number(reply.id),
        content: reply.content,
        postId: reply.postId ? Number(reply.postId) : null,
        discussionId: reply.discussionId ? Number(reply.discussionId) : null,
        authorId: Number(reply.authorId),
        parentId: reply.parentId ? Number(reply.parentId) : null,
        createdAt: reply.createdAt.toISOString(),
        author: {
          id: Number(reply.author.id),
          name: reply.author.name, // name is required in DB
          email: reply.author.email,
          image: reply.author.profilePicture || null,
          createdAt: reply.author.createdAt.toISOString(),
        },
      })),
    };

    return NextResponse.json(formattedComment, { status: 200 });
  } catch (error) {
    console.error('Error fetching comment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comment' },
      { status: 500 },
    );
  }
}

// DELETE /api/comments/[id] - Delete a specific comment
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const commentId = parseInt(resolvedParams.id, 10);

    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
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
      where: { id: commentId },
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
      where: { id: commentId },
    });

    // Invalidate cache for this comment and post comments
    revalidateTag(`comment-${commentId}`);
    if (comment.postId) {
      revalidateTag(`post-${comment.postId}-comments`);
    }
    revalidateTag('comments');

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
