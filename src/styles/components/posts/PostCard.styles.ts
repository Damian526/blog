import styled from 'styled-components';
export const Card = styled.div`
  margin: 1.5rem 0;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`;

export const Header = styled.div<{ imgUrl?: string }>`
  display: ${({ imgUrl }) => (imgUrl ? 'block' : 'none')};
  background: url(${({ imgUrl }) => imgUrl}) center/cover no-repeat;
  height: 160px;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

export const Title = styled.h2`
  font-size: 1.6rem;
  margin: 0 0 8px;
  padding-bottom: 4px;
  border-bottom: 3px solid #0070f3;
  display: inline-block;
`;

export const Meta = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const StatusBadge = styled.span<{
  status: 'published' | 'rejected' | 'pending';
}>`
  margin-left: auto;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  ${({ status }) =>
    status === 'published'
      ? `background: #e6ffe6; color: #009900;`
      : status === 'rejected'
        ? `background: #ffe6e6; color: #cc0000;`
        : `background: #fff3e6; color: #e67e22;`}
`;

export const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

export const CategoryTag = styled.span<{ color?: string }>`
  position: relative;
  padding-left: 16px;
  font-size: 0.85rem;
  color: #444;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background: ${({ color }) => color || '#ccc'};
    border-radius: 50%;
  }
`;

export const Excerpt = styled.p`
  flex: 1;
  font-size: 0.95rem;
  color: #333;
  line-height: 1.4;
  margin-bottom: 24px;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
`;

export const ReadMore = styled.a`
  font-size: 0.9rem;
  padding: 6px 14px;
  background: #0070f3;
  color: #fff;
  border-radius: 20px;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: #005bb5;
  }
`;

export const Actions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button<{ variant: 'edit' | 'delete' }>`
  padding: 6px 12px;
  font-size: 0.85rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: ${({ variant }) =>
    variant === 'delete' ? '#ff4d4f' : '#f0f0f0'};
  color: ${({ variant }) => (variant === 'delete' ? '#fff' : '#333')};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
