import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Your NextAuth configuration
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // 1️⃣ Check if the user is admin
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    // 2️⃣ Parse the `postId` from the request body
    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 },
      );
    }

    // 3️⃣ Find the post and verify it exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // 4️⃣ Update `published` to `true`
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { published: true },
    });

    return NextResponse.json({ message: 'Post published', post: updatedPost });
  } catch (error) {
    console.error('Error publishing post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
