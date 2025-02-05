import styled from 'styled-components';

export const CommentItem = styled.div<{ $isReply?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.75rem;
  border-radius: 10px;
  background-color: ${({ $isReply }) => ($isReply ? '#f9f9f9' : '#fff')};
  margin-top: 10px;
  margin-left: ${({ $isReply }) => ($isReply ? '30px' : '0')};
  border: ${({ $isReply }) => ($isReply ? '1px solid #ddd' : 'none')};
  box-shadow: ${({ $isReply }) =>
    $isReply ? 'none' : '0px 4px 8px rgba(0, 0, 0, 0.1)'};
`;

export const Avatar = styled.div`
  width: 2.5rem; /* 40px */
  height: 2.5rem; /* 40px */
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #fff;
`;

export const CommentContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Author = styled.div`
  font-size: 0.875rem; 
  font-weight: bold;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Timestamp = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

export const Content = styled.div`
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
  margin-top: 8px;
`;

export const CommentActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 8px;
  font-size: 0.875rem; /* 14px */
  color: #1877f2;
  cursor: pointer;

  & > span:hover {
    text-decoration: underline;
  }
`;
