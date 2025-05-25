import StyledComponentsRegistry from '@/lib/StyledComponentsRegistry';
import GlobalStyle from '@/styles/GlobalStyle';
import Header from '@/components/layout/Header';
import SessionProviderWrapper from '@/components/providers/SessionProviderWrapper';
import SWRProvider from '@/components/providers/SWRProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';

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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <SessionProviderWrapper session={session}>
            <SWRProvider>
              <Header />
              <div
                style={{
                  display: 'flex',
                  height: 'calc(100vh - 70px)',
                  overflow: 'hidden',
                }}
              >
                {/* Sidebar with modern styling */}
                <aside
                  style={{
                    width: '280px',
                    backgroundColor: 'var(--background)',
                    borderRight: '1px solid var(--border-color)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    height: '100%',
                  }}
                >
                  <Sidebar />
                </aside>

                {/* Main content area with improved spacing */}
                <main
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--background-secondary)',
                    padding: 'var(--space-xl)',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {children}
                </main>
              </div>
            </SWRProvider>
          </SessionProviderWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
