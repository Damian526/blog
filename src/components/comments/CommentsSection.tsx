'use client';

import useSWR from 'swr';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import EditableComment from '@/components/comments/EditableComment';
import AddCommentForm from '@/components/comments/AddCommentForm';
import ReplyForm from '@/components/comments/ReplyForm';

const CommentsContainer = styled.div`
  margin-top: 30px;
`;

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  parentId?: number | null;
  author: {
    name: string;
    email: string;
  };
  replies?: Comment[]; // Allow nested replies
}

interface CommentsSectionProps {
  postId: number;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const {
    data: comments,
    error,
    isLoading,
    mutate,
  } = useSWR<Comment[]>(postId ? `/api/comments?postId=${postId}` : null);

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        setCurrentUserEmail(data?.user?.email || null);
      } catch (err) {
        console.error('Failed to fetch current user:', err);
        setCurrentUserEmail(null);
      }
    }
    fetchCurrentUser();
  }, []);

  if (isLoading) return <p>Loading comments...</p>;
  if (error) return <p>Failed to load comments</p>;

  const handleDelete = async (commentId: number) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        const res = await fetch(`/api/comments?commentId=${commentId}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to delete comment');
        }

        mutate();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleEdit = async (commentId: number, updatedContent: string) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, content: updatedContent }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update comment');
      }

      mutate();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <CommentsContainer>
      <h2>Comments</h2>
      {comments && comments.length > 0 ? (
        comments
          .filter((comment) => !comment.parentId) // Show only top-level comments
          .map((comment) => (
            <div key={comment.id}>
              <EditableComment
                comment={comment}
                currentUserEmail={currentUserEmail}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
              <ReplyForm
                postId={postId}
                parentId={comment.id}
                onReplyAdded={mutate}
              />
              {/* Display replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div style={{ marginLeft: '20px' }}>
                  {comment.replies.map((reply) => (
                    <EditableComment
                      key={reply.id}
                      comment={reply}
                      currentUserEmail={currentUserEmail}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
      ) : (
        <p>No comments yet.</p>
      )}
      <AddCommentForm postId={postId} onCommentAdded={() => mutate()} />
    </CommentsContainer>
  );
}
