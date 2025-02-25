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
              <div style={{ display: 'flex', height: '100vh' }}>
                <Sidebar />
                <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
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
