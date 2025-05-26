import styled from 'styled-components';

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
`;

export const PostsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
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
  }
`; 