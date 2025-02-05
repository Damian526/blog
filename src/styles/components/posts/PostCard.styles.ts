import styled from 'styled-components';

export const Card = styled.div`
  border: 1px solid #ddd;
  padding: 1.25rem; /* 20px */
  border-radius: 8px;
  margin-bottom: 1.25rem; /* 20px */
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.625rem; /* 10px */
`;

export const ButtonContainer = styled.div`
  margin-top: 0.9375rem; /* 15px */
`;

export const Author = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1.25rem; /* 20px */
`;

export const ActionButton = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  padding: 0.5rem 1rem; /* 8px 16px */
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 0.625rem; /* 10px */

  &:hover {
    background-color: #005bb5;
  }

  &:last-child {
    margin-right: 0;
  }
`;
