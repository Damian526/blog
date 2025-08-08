import styled from 'styled-components';

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
