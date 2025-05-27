import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  height: calc(100vh - 70px);
  overflow: hidden;

  @media (max-width: 768px) {
    height: calc(100vh - 60px);
    flex-direction: column;
  }
`;

export const SidebarWrapper = styled.aside<{ $isVisible?: boolean }>`
  width: 280px;
  background-color: var(--background);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  transition: transform 0.3s ease;

  @media (max-width: 1024px) {
    width: 240px;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    left: 0;
    z-index: 50;
    height: calc(100vh - 60px);
    width: 280px;
    transform: translateX(${({ $isVisible }) => ($isVisible ? '0' : '-100%')});
    box-shadow: ${({ $isVisible }) =>
      $isVisible ? 'var(--shadow-xl)' : 'none'};
  }
`;

export const MainContent = styled.main<{ $sidebarVisible?: boolean }>`
  flex: 1;
  background-color: var(--background-secondary);
  padding: var(--space-responsive-lg);
  overflow: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: var(--space-responsive-md);
    margin-left: 0;
    filter: ${({ $sidebarVisible }) =>
      $sidebarVisible ? 'blur(2px)' : 'none'};
    transition: filter 0.3s ease;
  }
`;

export const SidebarToggle = styled.button`
  display: none;
  position: fixed;
  top: 80px;
  left: var(--space-md);
  z-index: 60;
  background: var(--primary-color);
  color: var(--background);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-hover);
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Overlay = styled.div<{ $isVisible: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }
`;

// Legacy export for backward compatibility
export const layoutStyles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 70px)',
    overflow: 'hidden',
  },
  sidebar: {
    width: '280px',
    backgroundColor: 'var(--background)',
    borderRight: '1px solid var(--border-color)',
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    height: '100%',
  },
  main: {
    flex: 1,
    backgroundColor: 'var(--background-secondary)',
    padding: 'var(--space-xl)',
    overflow: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
  },
};
