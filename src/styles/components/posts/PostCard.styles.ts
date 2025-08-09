import styled from 'styled-components';

export const Card = styled.div`
  margin: 0;
  background: var(--background);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--border-light);
  transition: all 0.2s ease;
  width: 100%;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08), 0 3px 10px rgba(0, 0, 0, 0.04);
    border-color: var(--primary-color);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    border-radius: 10px;

    &:hover {
      transform: translateY(-1px);
    }
  }
`;

export const Header = styled.div<{ imgUrl?: string }>`
  display: ${({ imgUrl }) => (imgUrl ? 'block' : 'none')};
  background: url(${({ imgUrl }) => imgUrl}) center/cover no-repeat;
  height: 160px;
  position: relative;
  aspect-ratio: 16/9;

  @media (max-width: 768px) {
    height: 140px;
  }

  @media (max-width: 480px) {
    height: 120px;
  }
`;

export const CardHeader = styled.div`
  height: 60px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  position: relative;

  @media (max-width: 768px) {
    height: 50px;
  }

  @media (max-width: 480px) {
    height: 40px;
  }
`;

export const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0.6) 100%
  );
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 12px;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    padding: 14px;
    gap: 8px;
  }
`;

export const TagsContainer = styled.div<{ $overlay?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  flex-wrap: wrap;

  ${({ $overlay }) => $overlay && `
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 2;
  `}
`;

export const Categories = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const CategoryTag = styled.span<{ color?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background: ${({ color }) => color ? `${color}15` : 'rgba(37, 99, 235, 0.1)'};
  color: ${({ color }) => color || 'var(--primary-color)'};
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid ${({ color }) => color ? `${color}30` : 'rgba(37, 99, 235, 0.2)'};
  white-space: nowrap;
  backdrop-filter: blur(4px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 3px 6px;
  }
`;

export const ReadingTime = styled.span`
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: var(--text-primary);

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

export const Excerpt = styled.p`
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 480px) {
    font-size: 13px;
    -webkit-line-clamp: 2;
  }
`;

export const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .metadata {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--text-secondary);
  }

  .author {
    font-weight: 500;
    color: var(--text-primary);
  }

  .separator {
    color: var(--text-tertiary);
  }

  .date {
    color: var(--text-secondary);
  }

  @media (max-width: 480px) {
    gap: 8px;
    
    .metadata {
      font-size: 13px;
      gap: 4px;
    }
  }
`;

export const AuthorAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 12px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }
`;

export const StatusBadge = styled.span<{
  $status: 'published' | 'rejected' | 'pending';
  $overlay?: boolean;
}>`
  ${({ $overlay }) => $overlay ? `
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
  ` : `
    margin-left: auto;
  `}
  
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  ${({ $status }) =>
    $status === 'published'
      ? `background: rgba(34, 197, 94, 0.9); color: white; border: 1px solid rgba(34, 197, 94, 0.3);`
      : $status === 'rejected'
        ? `background: rgba(239, 68, 68, 0.9); color: white; border: 1px solid rgba(239, 68, 68, 0.3);`
        : `background: rgba(245, 158, 11, 0.9); color: white; border: 1px solid rgba(245, 158, 11, 0.3);`}

  @media (max-width: 768px) {
    ${({ $overlay }) => !$overlay && `
      margin-left: 0;
      margin-top: 4px;
      flex-basis: 100%;
    `}
  }
`;

export const ReadMore = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-color);
  background: none;
  border: none;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  margin-top: auto;

  span {
    transition: transform 0.2s ease;
    font-size: 12px;
  }

  &:hover {
    color: var(--primary-color-dark);

    span {
      transform: translateX(2px);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    width: 100%;
    gap: 12px;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
`;

export const ActionButton = styled.button<{ $variant: 'edit' | 'delete' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 36px;
  flex: 1;
  justify-content: center;

  span {
    font-size: 14px;
  }

  ${({ $variant }) =>
    $variant === 'delete'
      ? `
        background: rgba(239, 68, 68, 0.1);
        color: var(--error-color);
        border-color: rgba(239, 68, 68, 0.2);
        
        &:hover {
          background: var(--error-color);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
      `
      : `
        background: rgba(37, 99, 235, 0.1);
        color: var(--primary-color);
        border-color: rgba(37, 99, 235, 0.2);
        
        &:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
      `}

  @media (max-width: 768px) {
    min-height: 40px;
    
    &:hover {
      transform: none;
    }
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 6px 12px;
  }
`;
