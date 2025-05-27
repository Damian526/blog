import styled from 'styled-components';

export const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-medium);
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 40px;
  border: 1px solid;
  text-decoration: none;
  white-space: nowrap;

  @media (max-width: 768px) {
    width: 100%;
    min-height: 44px;
    padding: var(--space-md);
    font-size: var(--font-medium);
  }

  @media (max-width: 480px) {
    font-size: var(--font-small);
  }
`;

export const PrimaryAuthButton = styled(BaseButton)`
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

export const SecondaryAuthButton = styled(BaseButton)`
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

export const DangerAuthButton = styled(BaseButton)`
  background: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
  border-color: rgba(239, 68, 68, 0.2);

  &:hover {
    background: var(--error-color);
    color: var(--background);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: none;
    }
  }
`;
