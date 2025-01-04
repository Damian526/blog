'use client';
import { SessionProvider } from 'next-auth/react';

interface SessionProviderWrapperProps {
  children: React.ReactNode;
  session: any;
}

export default function SessionProviderWrapper({
  children,
  session,
}: SessionProviderWrapperProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
