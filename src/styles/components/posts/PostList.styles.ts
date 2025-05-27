import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 var(--space-responsive-md);

  @media (max-width: 768px) {
    padding: 0;
  }
`;

export const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--space-responsive-lg);

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-lg);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
    padding: 0 var(--space-md);
  }

  @media (max-width: 480px) {
    gap: var(--space-sm);
    padding: 0 var(--space-sm);
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-responsive-xl);
  color: var(--text-secondary);
  grid-column: 1 / -1; /* Span full width */

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
