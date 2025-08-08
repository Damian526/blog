import styled from 'styled-components';
import { colors } from '../../colors';

export const Card = styled.div`
  margin: 0;
  background: var(--background);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-color);
  }

  @media (max-width: 768px) {
    border-radius: var(--radius-md);

    &:hover {
      transform: translateY(-1px);
    }
  }

  @media (max-width: 480px) {
    border-radius: var(--radius-sm);

    &:hover {
      transform: none;
    }
  }
`;

export const Header = styled.div<{ imgUrl?: string }>`
  display: ${({ imgUrl }) => (imgUrl ? 'block' : 'none')};
  background: url(${({ imgUrl }) => imgUrl}) center/cover no-repeat;
  height: 240px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.1) 100%
    );
  }

  @media (max-width: 768px) {
    height: 200px;
  }

  @media (max-width: 480px) {
    height: 180px;
  }
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--space-xl) var(--space-xl) var(--space-lg);
  gap: var(--space-md);

  @media (max-width: 768px) {
    padding: var(--space-lg);
    gap: var(--space-sm);
  }

  @media (max-width: 480px) {
    padding: var(--space-md);
  }
`;

export const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
  line-height: 1.3;
  transition: color 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  &:hover {
    color: var(--primary-color);
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    -webkit-line-clamp: 3;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

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
    font-size: 0.75rem;
    padding: 2px var(--space-xs);

    &::before {
      width: 4px;
      height: 4px;
    }
  }
`;

export const Excerpt = styled.p`
  flex: 1;
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: var(--space-sm) 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 1rem;
    -webkit-line-clamp: 3;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
  }
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-lg);
  margin-top: var(--space-md);
  border-top: 1px solid var(--border-light);
  gap: var(--space-sm);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-md);
  }
`;

export const ReadMore = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  font-size: var(--font-medium);
  font-weight: 600;
  padding: var(--space-md) var(--space-xl);
  background: transparent;
  color: var(--primary-color);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all 0.2s ease;
  border: 2px solid var(--primary-color);
  min-height: 44px;

  &:hover {
    background: var(--primary-color);
    color: var(--background);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &::after {
    content: '→';
    transition: transform 0.2s ease;
  }

  &:hover::after {
    transform: translateX(2px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: var(--space-md);

    &:hover {
      transform: none;
    }

    &:hover::after {
      transform: translateX(4px);
    }
  }

  @media (max-width: 480px) {
    font-size: var(--font-small);
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: var(--space-sm);

  @media (max-width: 768px) {
    width: 100%;
    gap: var(--space-md);
  }
`;

export const ActionButton = styled.button<{ $variant: 'edit' | 'delete' }>`
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-small);
  font-weight: 500;
  border: 1px solid;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 40px;
  flex: 1;

  ${({ $variant }) =>
    $variant === 'delete'
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

  @media (max-width: 768px) {
    min-height: 44px;
    padding: var(--space-md);

    &:hover {
      transform: none;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;
