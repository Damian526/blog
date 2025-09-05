import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { content, postId, parentId } = await request.json();

    if (!content || !postId || !parentId) {
      return NextResponse.json(
        { error: 'Content, postId, and parentId are required' },
        { status: 400 },
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to reply' },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parentComment) {
      return NextResponse.json(
        { error: 'Parent comment not found' },
        { status: 404 },
      );
    }

    const reply = await prisma.comment.create({
      data: {
        content,
        postId,
        parentId,
        authorId: user.id,
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

    const formattedReply = {
      id: Number(reply.id),
      content: reply.content,
      postId: reply.postId ? Number(reply.postId) : null,
      discussionId: reply.discussionId ? Number(reply.discussionId) : null,
      parentId: reply.parentId ? Number(reply.parentId) : null,
      authorId: Number(reply.authorId),
      createdAt: reply.createdAt.toISOString(),
      author: {
        id: Number(reply.author.id),
        name: reply.author.name, // name is required in DB
        email: reply.author.email,
        image: reply.author.profilePicture || null,
        createdAt: reply.author.createdAt.toISOString(),
      },
    };

    // Invalidate cache for parent comment, post comments, and general comments
    revalidateTag(`comment-${parentId}`);
    revalidateTag(`post-${postId}-comments`);
    revalidateTag('comments');

    return NextResponse.json(formattedReply, { status: 201 });
  } catch (error) {
    console.error('Error replying to comment:', error);
    return NextResponse.json(
      { error: 'Failed to reply to comment' },
      { status: 500 },
    );
  }
}
