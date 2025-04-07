import styled from 'styled-components';

export const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const Author = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

export const StatusContainer = styled.div`
  margin-top: 1rem;
`;

export const StatusBadge = styled.div<{
  status: 'published' | 'rejected' | 'pending';
}>`
  margin-top: 5px;
  padding: 6px 10px;
  border-radius: 5px;
  font-weight: bold;
  display: inline-block;

  ${({ status }) => {
    switch (status) {
      case 'published':
        return `
          color: green;
          background: #e6ffe6;
        `;
      case 'rejected':
        return `
          color: red;
          background: #ffe6e6;
        `;
      default: // "pending"
        return `
          color: #e67e22;
          background: #fff3e6;
        `;
    }
  }}
`;

export const ButtonContainer = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
`;

export const ActionButton = styled.button`
  padding: 8px 12px;
  background: #0070f3;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:nth-child(2) {
    background: red;

    &:hover {
      background: darkred;
    }
  }
`;

export const CategoriesContainer = styled.div`
  margin: 12px 0;
`;

export const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
`;

export const CategoryTag = styled.span`
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.9em;
  color: #666;
  transition: all 0.2s ease;

  &:hover {
    background: #e0e0e0;
    transform: translateY(-1px);
  }
`;
