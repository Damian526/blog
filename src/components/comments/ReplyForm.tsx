'use client';

import { useState } from 'react';
import styled from 'styled-components';

const ReplyContainer = styled.form`
  margin-top: 1rem;
  margin-left: 3rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    margin-left: 2rem;
    padding: 0.75rem;
  }

  @media (max-width: 480px) {
    margin-left: 1.5rem;
    padding: 0.75rem;
    border-radius: 6px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  line-height: 1.5;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease;
  margin-bottom: 0.75rem;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled.button`
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #475569;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.8rem;
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
`;

interface ReplyFormProps {
  postId: number;
  parentId: number;
  onReplyAdded: () => void;
  onCancel?: () => void;
}

export default function ReplyForm({
  postId,
  parentId,
  onReplyAdded,
  onCancel,
}: ReplyFormProps) {
  const [replyContent, setReplyContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!replyContent.trim()) {
      setError('Reply content is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/comments/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent.trim(),
          postId,
          parentId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post reply');
      }

      setReplyContent('');
      onReplyAdded();
      onCancel?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ReplyContainer onSubmit={handleSubmit}>
      <TextArea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder="Write a reply..."
        disabled={isSubmitting}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <ButtonGroup>
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Reply'}
        </SubmitButton>
        {onCancel && (
          <CancelButton type="button" onClick={onCancel}>
            Cancel
          </CancelButton>
        )}
      </ButtonGroup>
    </ReplyContainer>
  );
}
