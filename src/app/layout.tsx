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
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <SessionProviderWrapper session={session}>
            <SWRProvider>
              <Header />
              <div
                style={{
                  display: 'flex',
                  height: 'calc(100vh - 60px)', // Adjust for header height
                  overflow: 'hidden',
                }}
              >
                {/* Sidebar with vertical scrolling */}
                <aside
                  style={{
                    width: '250px',
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    height: '100%',
                  }}
                >
                  <Sidebar />
                </aside>

                {/* Main content area */}
                <main
                  style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    padding: '20px',
                    overflow: 'auto', 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
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
