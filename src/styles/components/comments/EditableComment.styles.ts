import styled from 'styled-components';
import { colors } from '../../colors';

export const CommentItem = styled.div<{ $isReply?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: ${({ $isReply }) => ($isReply ? '1.25rem' : '1.5rem')};
  border-radius: 12px;
  background-color: ${({ $isReply }) =>
    $isReply ? colors.backgroundSecondary : colors.background};
  margin-top: ${({ $isReply }) => ($isReply ? '1rem' : '2rem')};
  margin-left: ${({ $isReply }) => ($isReply ? '3rem' : '0')};
  border: ${({ $isReply }) =>
    $isReply
      ? `1px solid ${colors.border}`
      : `1px solid ${colors.borderLight}`};
  box-shadow: ${({ $isReply }) =>
    $isReply ? 'var(--shadow-sm)' : 'var(--shadow-md)'};
  transition: all 0.2s ease-in-out;
  position: relative;

  &:hover {
    box-shadow: ${({ $isReply }) =>
      $isReply ? '0 2px 4px rgba(0, 0, 0, 0.08)' : 'var(--shadow-lg)'};
    transform: translateY(-1px);
  }

  ${({ $isReply }) =>
    $isReply &&
    `
    &::before {
      content: '';
      position: absolute;
      left: -2rem;
      top: 1.5rem;
      width: 1.5rem;
      height: 2px;
      background-color: #cbd5e1;
      border-radius: 1px;
    }
  `}

  @media (max-width: 768px) {
    gap: 0.75rem;
    padding: ${({ $isReply }) => ($isReply ? '0.75rem' : '1rem')};
    margin-left: ${({ $isReply }) => ($isReply ? '2rem' : '0')};

    ${({ $isReply }) =>
      $isReply &&
      `
      &::before {
        left: -1.5rem;
        width: 1rem;
      }
    `}
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    padding: 0.75rem;
    margin-left: ${({ $isReply }) => ($isReply ? '1.5rem' : '0')};
    border-radius: 8px;

    ${({ $isReply }) =>
      $isReply &&
      `
      &::before {
        left: -1rem;
        width: 0.75rem;
      }
    `}
  }
`;

export const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #ffffff;
  font-size: 1.25rem;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  flex-shrink: 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover::after {
    opacity: 0.2;
  }

  @media (max-width: 768px) {
    width: 2.75rem;
    height: 2.75rem;
    font-size: 1.1rem;
  }
`;

export const CommentContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

export const Author = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Timestamp = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 400;
  background-color: #f1f5f9;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
`;

export const Content = styled.div`
  font-size: 1.05rem;
  color: #374151;
  line-height: 1.7;
  margin-bottom: 1rem;
  word-wrap: break-word;
  white-space: pre-wrap;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

export const CommentActions = styled.div`
  display: flex;
  gap: 1.25rem;
  font-size: 0.85rem;

  & > span {
    color: #6366f1;
    cursor: pointer;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      background-color: #eef2ff;
      color: #4f46e5;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  & > span.delete {
    color: #ef4444;

    &:hover {
      background-color: #fef2f2;
      color: #dc2626;
    }
  }

  & > span.edit {
    color: #059669;

    &:hover {
      background-color: #f0fdf4;
      color: #047857;
    }
  }
`;

export const EditTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.5;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const EditActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;

  & > button {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;

    &.save {
      background-color: #6366f1;
      color: white;

      &:hover {
        background-color: #5b21b6;
        transform: translateY(-1px);
      }
    }

    &.cancel {
      background-color: #f1f5f9;
      color: #64748b;

      &:hover {
        background-color: #e2e8f0;
        color: #475569;
      }
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
`;
