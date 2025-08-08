import styled from 'styled-components';

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-responsive-md);
  background: var(--background);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    height: 60px;
    padding: var(--space-sm) var(--space-md);
  }
`;

export const AppName = styled.h1`
  font-size: var(--font-xl);
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
  cursor: pointer;
  text-decoration: none;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--accent-color)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    font-size: var(--font-large);
    &:hover {
      transform: none;
    }
  }

  @media (max-width: 480px) {
    font-size: var(--font-medium);
  }
`;
