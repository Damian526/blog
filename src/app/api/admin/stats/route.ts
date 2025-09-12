import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const [
      totalUsers,
      totalPosts,
      totalComments,
      pendingUsers,
      pendingPosts,
      verificationRequests,
      publishedPosts,
      verifiedUsers,
      expertUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.user.count({ where: { verified: false } }),
      prisma.post.count({ where: { published: false, declineReason: null } }),
      prisma.user.count({ 
        where: { 
          verified: false, 
          verificationReason: { not: null } 
        } 
      }),
      prisma.post.count({ where: { published: true } }),
      prisma.user.count({ where: { verified: true } }),
      prisma.user.count({ where: { isExpert: true } }),
    ]);

    const stats = {
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        pending: pendingUsers,
        experts: expertUsers,
        verificationRequests,
      },
      posts: {
        total: totalPosts,
        published: publishedPosts,
        pending: pendingPosts,
        rejected: totalPosts - publishedPosts - pendingPosts,
      },
      comments: {
        total: totalComments,
      },
      overview: {
        totalUsers,
        totalPosts,
        totalComments,
        pendingApprovals: pendingUsers + pendingPosts,
      },
    };

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
