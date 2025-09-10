'use client';

import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 0 var(--space-responsive-lg);

  @media (max-width: 1200px) {
    max-width: 95%;
    padding: 0 var(--space-responsive-md);
  }

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 var(--space-md);
  }
`;

export const PostsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-responsive-xl);

  @media (max-width: 768px) {
    gap: var(--space-lg);
  }

  @media (max-width: 480px) {
    gap: var(--space-md);
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-responsive-xl);
  color: var(--text-secondary);

  h3 {
    font-size: var(--font-xl);
    margin-bottom: var(--space-md);
    color: var(--text-primary);

    @media (max-width: 768px) {
      font-size: var(--font-large);
    }
  }

  p {
    font-size: var(--font-medium);
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto;

    @media (max-width: 768px) {
      font-size: var(--font-small);
    }
  }

  @media (max-width: 768px) {
    padding: var(--space-xl) var(--space-md);
  }
`;
