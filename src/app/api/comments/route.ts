import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

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

    // Format the response to ensure consistent data types
    const formattedComment = {
      id: Number(newComment.id),
      content: newComment.content,
      postId: newComment.postId ? Number(newComment.postId) : null,
      discussionId: newComment.discussionId ? Number(newComment.discussionId) : null,
      parentId: newComment.parentId ? Number(newComment.parentId) : null,
      authorId: Number(newComment.authorId),
      createdAt: newComment.createdAt.toISOString(),
      author: {
        id: Number(newComment.author.id),
        name: newComment.author.name, // name is required in DB
        email: newComment.author.email,
        image: newComment.author.profilePicture || null,
        createdAt: newComment.author.createdAt.toISOString(),
      },
    };

    // Invalidate cache for this post's comments
    revalidateTag(`post-${postId}-comments`);
    revalidateTag('comments');

    return NextResponse.json(formattedComment, { status: 201 });
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
      where: { postId: parseInt(postId, 10), parentId: null }, // Fetch only top-level comments
      include: {
        author: { 
          select: { 
            id: true,
            name: true, 
            email: true,
            profilePicture: true,
            createdAt: true,
          } 
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
              } 
            } 
          }, // Include replies
        },
      },
    });

    // Format the response to ensure consistent data types
    const formattedComments = comments.map((comment) => ({
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
    }));

    return NextResponse.json(formattedComments, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 },
    );
  }
}



