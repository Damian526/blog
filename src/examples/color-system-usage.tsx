import styled from 'styled-components';
import { colors, getColor } from '../styles/colors';

/**
 * Example component demonstrating the global color system usage
 */

// Using colors object directly
export const ExampleCard = styled.div`
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.primary};
    box-shadow: var(--shadow-lg);
  }
`;

// Using status colors for different states
export const StatusBadge = styled.span<{
  status: 'success' | 'warning' | 'error' | 'info';
}>`
  display: inline-flex;
  align-items: center;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-small);
  font-weight: 600;

  ${({ status }) => {
    switch (status) {
      case 'success':
        return `
          background: ${colors.successBg};
          color: ${colors.success};
          border: 1px solid ${colors.successBorder};
        `;
      case 'warning':
        return `
          background: ${colors.warningBg};
          color: ${colors.warning};
          border: 1px solid ${colors.warningBorder};
        `;
      case 'error':
        return `
          background: ${colors.errorBg};
          color: ${colors.error};
          border: 1px solid ${colors.errorBorder};
        `;
      case 'info':
        return `
          background: ${colors.infoBg};
          color: ${colors.info};
          border: 1px solid ${colors.infoBorder};
        `;
      default:
        return `
          background: ${colors.primaryBg};
          color: ${colors.primary};
          border: 1px solid ${colors.primaryBorder};
        `;
    }
  }}
`;

// Using getColor helper function
export const PrimaryButton = styled.button`
  background: ${getColor('primary')};
  color: ${getColor('background')};
  border: 1px solid ${getColor('primary')};
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${getColor('primaryHover')};
    border-color: ${getColor('primaryHover')};
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    background: ${getColor('textMuted')};
    border-color: ${getColor('textMuted')};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Text with different hierarchy levels
export const PrimaryText = styled.p`
  color: ${colors.textPrimary};
  font-size: var(--font-medium);
  line-height: 1.6;
  margin: 0;
`;

export const SecondaryText = styled.p`
  color: ${colors.textSecondary};
  font-size: var(--font-small);
  line-height: 1.5;
  margin: 0;
`;

export const MutedText = styled.span`
  color: ${colors.textMuted};
  font-size: var(--font-small);
`;

// Example usage in a React component:
/*
function ExampleComponent() {
  return (
    <ExampleCard>
      <PrimaryText>This is the main content</PrimaryText>
      <SecondaryText>This is secondary information</SecondaryText>
      <MutedText>Last updated 2 hours ago</MutedText>
      
      <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
        <StatusBadge status="success">Published</StatusBadge>
        <StatusBadge status="warning">Pending</StatusBadge>
        <StatusBadge status="error">Rejected</StatusBadge>
        <StatusBadge status="info">Draft</StatusBadge>
      </div>
      
      <PrimaryButton style={{ marginTop: 'var(--space-lg)' }}>
        Take Action
      </PrimaryButton>
    </ExampleCard>
  );
}
*/
