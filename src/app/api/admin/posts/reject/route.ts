import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // Ensure user is admin
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Access denied' }, { status: 403 });
  }

  try {
    // Parse JSON body for postId and reason
    const { postId, reason } = await req.json();

    if (!postId || !reason) {
      return NextResponse.json(
        { message: 'postId and reason are required' },
        { status: 400 },
      );
    }

    // Find the post
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Mark as unpublished & store decline reason
    await prisma.post.update({
      where: { id: postId },
      data: {
        published: false,
        declineReason: reason,
      },
    });

    return NextResponse.json(
      { message: 'Post declined successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error declining post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
