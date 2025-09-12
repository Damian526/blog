'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { api } from '@/server/api';
import {
  FormTextarea,
  FormButton,
  ButtonGroup,
  ErrorMessage,
} from '@/components/ui/forms/FormComponents';

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
      await api.comments.create({
        content: replyContent.trim(),
        postId,
        parentId
      });

      setReplyContent('');
      onReplyAdded();
      onCancel?.();
    } catch (err: any) {
      setError(err.message || 'Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ReplyContainer onSubmit={handleSubmit}>
      <FormTextarea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder="Write a reply..."
        disabled={isSubmitting}
        style={{ 
          minHeight: '80px', 
          fontSize: '0.9rem',
          marginBottom: '0.75rem'
        }}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <ButtonGroup>
        <FormButton type="submit" disabled={isSubmitting} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          {isSubmitting ? 'Posting...' : 'Reply'}
        </FormButton>
        {onCancel && (
          <FormButton 
            type="button" 
            onClick={onCancel} 
            variant="secondary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            Cancel
          </FormButton>
        )}
      </ButtonGroup>
    </ReplyContainer>
  );
}
