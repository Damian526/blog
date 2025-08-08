// Button.tsx
import React from 'react';
import * as S from './Button.styles';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  children,
  onClick,
}) => {
  return (
    <S.StyledButton
      $variant={variant}
      $size={size}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </S.StyledButton>
  );
};

// Button.styles.ts
import styled, { css } from 'styled-components';
import { colors } from '../styles/colors';

interface StyledButtonProps {
  $variant: 'primary' | 'secondary' | 'danger';
  $size: 'small' | 'medium' | 'large';
}

// Size variants
const sizeStyles = {
  small: css`
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--font-small);
  `,
  medium: css`
    padding: var(--space-sm) var(--space-lg);
    font-size: var(--font-medium);
  `,
  large: css`
    padding: var(--space-md) var(--space-xl);
    font-size: var(--font-large);
  `,
};

// Variant styles
const variantStyles = {
  primary: css`
    background: ${colors.primary};
    color: ${colors.background};
    border: 1px solid ${colors.primary};

    &:hover:not(:disabled) {
      background: ${colors.primaryHover};
      border-color: ${colors.primaryHover};
    }
  `,
  secondary: css`
    background: ${colors.background};
    color: ${colors.primary};
    border: 1px solid ${colors.border};

    &:hover:not(:disabled) {
      background: ${colors.backgroundSecondary};
      border-color: ${colors.primary};
    }
  `,
  danger: css`
    background: ${colors.error};
    color: ${colors.background};
    border: 1px solid ${colors.error};

    &:hover:not(:disabled) {
      background: ${colors.errorDark};
      border-color: ${colors.errorDark};
    }
  `,
};

export const StyledButton = styled.button<StyledButtonProps>`
  /* Base styles */
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  /* Apply size styles */
  ${({ $size }) => sizeStyles[$size]}

  /* Apply variant styles */
  ${({ $variant }) => variantStyles[$variant]}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  /* Interactive states */
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  /* Focus styles for accessibility */
  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

/* 
Usage Example:

<Button variant="primary" size="large" onClick={handleClick}>
  Save Changes
</Button>

<Button variant="secondary" size="small">
  Cancel
</Button>

<Button variant="danger" disabled>
  Delete Account
</Button>
*/
