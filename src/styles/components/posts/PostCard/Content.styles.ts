import styled from 'styled-components';

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
