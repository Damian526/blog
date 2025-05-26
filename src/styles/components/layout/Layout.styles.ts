import { CSSProperties } from 'react';

export const layoutStyles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 70px)',
    overflow: 'hidden',
  } as CSSProperties,

  sidebar: {
    width: '280px',
    backgroundColor: 'var(--background)',
    borderRight: '1px solid var(--border-color)',
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '100%',
  } as CSSProperties,

  main: {
    flex: 1,
    backgroundColor: 'var(--background-secondary)',
    padding: 'var(--space-xl)',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  } as CSSProperties,
}; 