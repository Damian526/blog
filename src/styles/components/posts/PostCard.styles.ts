import styled from 'styled-components';

export const Card = styled.div`
  margin: 0 0 var(--space-xl) 0;
  background: var(--background);
  border-radius: var(--radius-xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-color);
  }
`;

export const Header = styled.div<{ imgUrl?: string }>`
  display: ${({ imgUrl }) => (imgUrl ? 'block' : 'none')};
  background: url(${({ imgUrl }) => imgUrl}) center/cover no-repeat;
  height: 200px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%);
  }
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--space-xl);
  gap: var(--space-md);
`;

export const Title = styled.h2`
  font-size: var(--font-xl);
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
  line-height: 1.3;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--primary-color);
  }
`;

export const Meta = styled.div`
  font-size: var(--font-small);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 500;
`;

export const StatusBadge = styled.span<{
  status: 'published' | 'rejected' | 'pending';
}>`
  margin-left: auto;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-small);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  ${({ status }) =>
    status === 'published'
      ? `background: rgba(16, 185, 129, 0.1); color: var(--success-color); border: 1px solid rgba(16, 185, 129, 0.2);`
      : status === 'rejected'
        ? `background: rgba(239, 68, 68, 0.1); color: var(--error-color); border: 1px solid rgba(239, 68, 68, 0.2);`
        : `background: rgba(245, 158, 11, 0.1); color: var(--warning-color); border: 1px solid rgba(245, 158, 11, 0.2);`}
`;

export const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
`;

export const CategoryTag = styled.span<{ color?: string }>`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: rgba(37, 99, 235, 0.1);
  color: var(--primary-color);
  border-radius: var(--radius-md);
  font-size: var(--font-small);
  font-weight: 500;
  border: 1px solid rgba(37, 99, 235, 0.2);
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
  }
`;

export const Excerpt = styled.p`
  flex: 1;
  font-size: var(--font-medium);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-light);
`;

export const ReadMore = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-medium);
  font-weight: 500;
  padding: var(--space-sm) var(--space-lg);
  background: var(--primary-color);
  color: var(--background);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid var(--primary-color);

  &:hover {
    background: var(--primary-hover);
    border-color: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &::after {
    content: '→';
    transition: transform 0.2s ease;
  }

  &:hover::after {
    transform: translateX(2px);
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

export const ActionButton = styled.button<{ variant: 'edit' | 'delete' }>`
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-small);
  font-weight: 500;
  border: 1px solid;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ variant }) =>
    variant === 'delete'
      ? `
        background: rgba(239, 68, 68, 0.1);
        color: var(--error-color);
        border-color: rgba(239, 68, 68, 0.2);
        
        &:hover {
          background: var(--error-color);
          color: var(--background);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
      `
      : `
        background: rgba(100, 116, 139, 0.1);
        color: var(--secondary-color);
        border-color: rgba(100, 116, 139, 0.2);
        
        &:hover {
          background: var(--secondary-color);
          color: var(--background);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
      `}

  a {
    color: inherit;
    text-decoration: none;
  }
`;
