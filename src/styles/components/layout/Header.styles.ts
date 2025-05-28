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

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);

  @media (max-width: 768px) {
    gap: var(--space-sm);
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-primary);
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-sm);
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--background-tertiary);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

export const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--background);
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
    flex-direction: column;
    padding: var(--space-md);
    gap: var(--space-md);
    z-index: 99;
  }
`;

export const DesktopButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ModernButton = styled.button`
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-medium);
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;

  @media (max-width: 768px) {
    width: 100%;
    padding: var(--space-md);
    font-size: var(--font-medium);
    min-height: 44px;
  }
`;

export const PrimaryButton = styled(ModernButton)`
  background: var(--primary-color);
  color: var(--background);
  border-color: var(--primary-color);

  &:hover {
    background: var(--primary-hover);
    border-color: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: none;
    }
  }
`;

export const SecondaryButton = styled(ModernButton)`
  background: var(--background);
  color: var(--text-primary);
  border-color: var(--border-color);

  &:hover {
    background: var(--background-tertiary);
    border-color: var(--primary-color);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: none;
    }
  }
`;

export const AdminButton = styled(PrimaryButton)`
  background: var(--warning-color);
  border-color: var(--warning-color);

  &:hover {
    background: #d97706;
    border-color: #d97706;
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

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-secondary);
  font-size: var(--font-small);
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;

  &:hover {
    background: var(--background-tertiary);
    color: var(--text-primary);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: var(--space-sm);
    background: var(--background-tertiary);
    border-radius: var(--radius-md);

    &:hover {
      background: var(--primary-color);
      color: var(--background);
      transform: none;
    }

    span {
      font-size: var(--font-medium);
    }
  }

  @media (max-width: 480px) {
    span {
      display: none;
    }
  }
`;

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--accent-color)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--background);
  font-weight: 600;
  font-size: var(--font-small);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;
