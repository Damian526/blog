import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If user is not logged in or is not an admin, redirect them to the homepage
  if (!token || token.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// Apply middleware only for admin pages
export const config = {
  matcher: '/admin/:path*',
};
