'use client';

import styled from 'styled-components';
import { colors } from '../../colors';

// Dashboard Content Styles
export const DashboardHeader = styled.div`
  background: var(--background);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  margin-bottom: var(--space-xl);
`;

export const Title = styled.h1`
  font-size: var(--font-xxl);
  font-weight: 700;
  margin: 0 0 var(--space-md) 0;
  color: var(--text-primary);
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--accent-color)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const WelcomeText = styled.p`
  font-size: var(--font-large);
  color: var(--text-secondary);
  margin: 0 0 var(--space-xl) 0;
  line-height: 1.6;
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  font-size: var(--font-medium);
  font-weight: 600;
  background: var(--primary-color);
  color: var(--background);
  border: 1px solid var(--primary-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background: var(--primary-hover);
    border-color: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &::before {
    content: '+';
    font-size: var(--font-large);
    font-weight: 700;
  }
`;

export const UserBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--primary-bg);
  color: var(--primary-color);
  border-radius: var(--radius-md);
  font-size: var(--font-small);
  font-weight: 600;
  border: 1px solid var(--primary-border);
  margin-bottom: var(--space-md);

  &::before {
    content: '👋';
    font-size: var(--font-medium);
  }
`;

// Dashboard Page Styles
export const PostsSection = styled.div`
  background: var(--background);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
`;

export const SectionTitle = styled.h2`
  font-size: var(--font-xl);
  font-weight: 600;
  margin: 0 0 var(--space-lg) 0;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  &::before {
    content: '📝';
    font-size: var(--font-large);
  }
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-secondary);
  font-size: var(--font-medium);
`;

export const ErrorState = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  color: var(--error-color);
  background: var(--error-bg);
  border: 1px solid var(--error-border);
  border-radius: var(--radius-md);
  font-size: var(--font-medium);
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-secondary);

  h3 {
    font-size: var(--font-xl);
    margin-bottom: var(--space-md);
    color: var(--text-primary);
  }

  p {
    font-size: var(--font-medium);
    line-height: 1.6;
    margin-bottom: var(--space-lg);
  }
`;

export const UnauthenticatedMessage = styled.div`
  text-align: center;
  margin-top: var(--space-2xl);
  padding: var(--space-xl);
  background: var(--background);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: var(--font-large);
`;
