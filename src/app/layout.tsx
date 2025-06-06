import StyledComponentsRegistry from '@/lib/StyledComponentsRegistry';
import GlobalStyle from '@/styles/GlobalStyle';
import Header from '@/components/layout/Header';
import SessionProviderWrapper from '@/components/providers/SessionProviderWrapper';
import SWRProvider from '@/components/providers/SWRProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';
import ResponsiveLayoutWrapper from '@/components/layout/ResponsiveLayoutWrapper';

export const metadata = {
  title: 'WebDevSphere',
  description: 'Articles about web development',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <SessionProviderWrapper session={session}>
            <SWRProvider>
              <Header />
              <ResponsiveLayoutWrapper sidebar={<Sidebar />}>
                {children}
              </ResponsiveLayoutWrapper>
            </SWRProvider>
          </SessionProviderWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
