'use client';

import useSWR from 'swr';
import styled from 'styled-components';
import { useState } from 'react';
import EditableComment from '@/components/comments/EditableComment';
import AddCommentForm from '@/components/comments/AddCommentForm';
import ReplyForm from '@/components/comments/ReplyForm';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Comment } from '@/server/api/types';
import { api } from '@/server/api';

const CommentsContainer = styled.div`
  margin-top: 0;
  width: 100%;
  background: #ffffff;
  padding: 3rem 4rem;
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;

  @media (max-width: 1200px) {
    padding: 3rem;
  }

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 8px;
  }
`;

const CommentsHeader = styled.div`
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f1f5f9;
`;

const CommentsTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: '💬';
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;

    &::before {
      font-size: 1.25rem;
    }
  }
`;

const CommentsCount = styled.span`
  font-size: 1rem;
  color: #64748b;
  font-weight: 400;
  background-color: #f1f5f9;
  padding: 0.375rem 1rem;
  border-radius: 12px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.25rem 0.75rem;
  }
`;

const CommentsList = styled.div`
  margin-bottom: 2rem;
`;

const CommentThread = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const RepliesContainer = styled.div`
  margin-top: 1rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 1.375rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, #e2e8f0, transparent);
    border-radius: 1px;
  }

  @media (max-width: 768px) {
    &::before {
      left: 1rem;
    }
  }

  @media (max-width: 480px) {
    &::before {
      left: 0.75rem;
      width: 1px;
    }
  }
`;

const NoCommentsMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;
  font-size: 1rem;

  &::before {
    content: '💭';
    display: block;
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 1rem;
`;

interface CommentsSectionProps {
  postId: number;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const {
    data: comments,
    error,
    isLoading,
    mutate,
  } = useSWR<Comment[]>(
    postId ? `comments-${postId}` : null,
    () => postId ? api.comments.getByPost(postId) : null
  );

  const { user: currentUser } = useCurrentUser();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const currentUserEmail = currentUser?.email || null;

  console.log('CommentsSection:', { postId, comments, error, isLoading });

  if (isLoading) return <LoadingMessage>Loading comments...</LoadingMessage>;
  if (error) {
    console.error('Comments error:', error);
    return <LoadingMessage>Failed to load comments: {error.message}</LoadingMessage>;
  }

  const handleDelete = async (commentId: number) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.comments.delete(commentId);
        mutate();
      } catch (err: any) {
        alert(err.message || 'Failed to delete comment');
      }
    }
  };

  const handleEdit = async (commentId: number, updatedContent: string) => {
    try {
      await api.comments.update(commentId, { content: updatedContent });
      mutate();
    } catch (err: any) {
      alert(err.message || 'Failed to update comment');
    }
  };

  const handleReplyAdded = () => {
    mutate();
    setReplyingTo(null);
  };

  const topLevelComments =
    comments?.filter((comment) => !comment.parentId) || [];
  const totalComments = comments?.length || 0;

  return (
    <CommentsContainer>
      <CommentsHeader>
        <CommentsTitle>
          Comments
          <CommentsCount>{totalComments}</CommentsCount>
        </CommentsTitle>
      </CommentsHeader>

      <CommentsList>
        {topLevelComments.length > 0 ? (
          topLevelComments.map((comment) => (
            <CommentThread key={comment.id}>
              <EditableComment
                comment={comment}
                currentUserEmail={currentUserEmail}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onReplyClick={() => setReplyingTo(comment.id)}
              />

              {comment.replies && comment.replies.length > 0 && (
                <RepliesContainer>
                  {comment.replies.map((reply) => (
                    <EditableComment
                      key={reply.id}
                      comment={reply}
                      currentUserEmail={currentUserEmail}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      onReplyClick={() => setReplyingTo(reply.id)}
                    />
                  ))}
                </RepliesContainer>
              )}

              {replyingTo === comment.id && (
                <ReplyForm
                  postId={postId}
                  parentId={comment.id}
                  onReplyAdded={handleReplyAdded}
                  onCancel={() => setReplyingTo(null)}
                />
              )}
            </CommentThread>
          ))
        ) : (
          <NoCommentsMessage>
            No comments yet. Be the first to share your thoughts!
          </NoCommentsMessage>
        )}
      </CommentsList>

      <AddCommentForm postId={postId} onCommentAdded={() => mutate()} />
    </CommentsContainer>
  );
}
