import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ user: null });
    }

    // Fetch the complete user data from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        role: true,
        verified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Format the response to match our UserSchema
    const formattedUser = {
      id: Number(user.id),
      name: user.name,
      email: user.email,
      image: user.profilePicture || null,
      role: user.role,
      emailVerified: user.verified,
      verified: user.verified,
      createdAt: user.createdAt.toISOString(),
    };

    return NextResponse.json({ user: formattedUser });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ user: null });
  }
}
