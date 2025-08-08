import styled from 'styled-components';

export const Meta = styled.div`
  font-size: var(--font-small);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 500;
  flex-wrap: wrap;
  margin-bottom: var(--space-xs);

  @media (max-width: 480px) {
    font-size: 0.75rem;
    gap: var(--space-xs);
  }
`;

export const StatusBadge = styled.span<{
  $status: 'published' | 'rejected' | 'pending';
}>`
  margin-left: auto;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-small);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  ${({ $status }) =>
    $status === 'published'
      ? `background: var(--success-bg); color: var(--success-color); border: 1px solid var(--success-border);`
      : $status === 'rejected'
        ? `background: var(--error-bg); color: var(--error-color); border: 1px solid var(--error-border);`
        : `background: var(--warning-bg); color: var(--warning-color); border: 1px solid var(--warning-border);`}

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: var(--space-xs);
    flex-basis: 100%;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 2px var(--space-xs);
  }
`;

export const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);

  @media (max-width: 480px) {
    gap: var(--space-xs);
  }
`;

export const CategoryTag = styled.span<{ color?: string }>`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: var(--primary-bg);
  color: var(--primary-color);
  border-radius: var(--radius-md);
  font-size: var(--font-small);
  font-weight: 500;
  border: 1px solid var(--primary-border);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(37, 99, 235, 0.15);
    transform: translateY(-1px);
  }

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: ${({ color }) => color || 'var(--primary-color)'};
    border-radius: 50%;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    &:hover {
      transform: none;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 2px var(--space-xs);
  }
`;
