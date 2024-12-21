'use client'; // Mark this as a client component

import './globals.scss';
import Header from '@/components/layout/Header';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <Header />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
