/**
 * EXAMPLE FILE - NOT ACTUAL WORKING CODE
 *
 * This file demonstrates best practices for creating styled components
 * with proper TypeScript integration and global color system usage.
 *
 * To use this pattern in your app:
 * 1. Create separate Component.tsx and Component.styles.ts files
 * 2. Import the styles file into your component
 * 3. Follow the structure shown below
 */

// @ts-nocheck - This is an example file showing patterns, not working code

// Button.tsx
import React from 'react';
// import * as S from './Button.styles';  // This would be the real import in an actual component

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
    <StyledButton
      $variant={variant}
      $size={size}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </StyledButton>
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
===========================================
USAGE EXAMPLE IN REAL COMPONENTS:
===========================================

// src/components/ui/Button/Button.tsx
import React from 'react';
import * as S from './Button.styles';

export const Button: React.FC<ButtonProps> = (props) => {
  return <S.StyledButton {...props}>{props.children}</S.StyledButton>;
};

// src/components/ui/Button/Button.styles.ts  
import styled from 'styled-components';
import { colors } from '../../../styles/colors';

export const StyledButton = styled.button`
  background: ${colors.primary};
  // ... rest of styles
`;

// Usage in your app:
<Button variant="primary" size="large" onClick={handleClick}>
  Save Changes
</Button>

<Button variant="secondary" size="small">
  Cancel
</Button>

<Button variant="danger" disabled>
  Delete Account
</Button>

===========================================
*/
