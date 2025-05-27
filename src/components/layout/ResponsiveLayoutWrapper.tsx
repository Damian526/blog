'use client';

import { useState, useEffect, ReactNode } from 'react';
import {
  LayoutContainer,
  SidebarWrapper,
  MainContent,
  SidebarToggle,
  Overlay,
} from '@/styles/components/layout/Layout.styles';

interface ResponsiveLayoutWrapperProps {
  children: React.ReactNode;
  sidebar: ReactNode;
}

export default function ResponsiveLayoutWrapper({
  children,
  sidebar,
}: ResponsiveLayoutWrapperProps) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsSidebarVisible(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
  };

  return (
    <>
      <LayoutContainer>
        <SidebarWrapper $isVisible={isSidebarVisible}>{sidebar}</SidebarWrapper>

        <MainContent $sidebarVisible={isSidebarVisible}>{children}</MainContent>
      </LayoutContainer>

      {isMobile && (
        <>
          <SidebarToggle onClick={toggleSidebar}>
            {isSidebarVisible ? '✕' : '☰'}
          </SidebarToggle>

          <Overlay $isVisible={isSidebarVisible} onClick={closeSidebar} />
        </>
      )}
    </>
  );
}
