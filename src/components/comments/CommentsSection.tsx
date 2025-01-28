'use client';

import useSWR from 'swr';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

// Styled components
const CommentsContainer = styled.div`
  margin-top: 30px;
`;

const CommentItem = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Author = styled.p`
  font-size: 0.9rem;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Content = styled.p`
  font-size: 1rem;
  line-height: 1.4;
  flex-grow: 1;
  margin-right: 10px;
`;

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
}

interface CommentsSectionProps {
  postId: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const {
    data: comments,
    error,
    isLoading,
    mutate,
  } = useSWR<Comment[]>(
    postId ? `/api/comments?postId=${postId}` : null,
    fetcher,
  );

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  // Fetch the current user's email
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

  async function handleDelete(commentId: number) {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        const res = await fetch(`/api/comments?commentId=${commentId}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to delete comment');
        }

        // Refresh comments after deletion
        mutate();
      } catch (err: any) {
        alert(err.message);
      }
    }
  }

  async function handleEdit(commentId: number, updatedContent: string) {
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

      // Refresh comments after editing
      mutate();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <CommentsContainer>
      <h2>Comments</h2>
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <EditableComment
            key={comment.id}
            comment={comment}
            currentUserEmail={currentUserEmail}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))
      ) : (
        <p>No comments yet.</p>
      )}

      <AddCommentForm postId={postId} onCommentAdded={() => mutate()} />
    </CommentsContainer>
  );
}

function EditableComment({
  comment,
  currentUserEmail,
  onDelete,
  onEdit,
}: {
  comment: Comment;
  currentUserEmail: string | null;
  onDelete: (commentId: number) => void;
  onEdit: (commentId: number, updatedContent: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleSave = () => {
    onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  return (
    <CommentItem>
      <div>
        <Author>
          {comment.author.name} —{' '}
          {new Date(comment.createdAt).toLocaleDateString()}
        </Author>
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            style={{ width: '100%', marginTop: '10px' }}
          />
        ) : (
          <Content>{comment.content}</Content>
        )}
      </div>
      {currentUserEmail === comment.author.email && (
        <CommentActions>
          {isEditing ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDelete(comment.id)}>Delete</button>
            </>
          )}
        </CommentActions>
      )}
    </CommentItem>
  );
}

// AddCommentForm component remains unchanged
function AddCommentForm({
  postId,
  onCommentAdded,
}: {
  postId: number;
  onCommentAdded: () => void;
}) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!content) {
      setError('Comment content is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, postId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create comment');
      }

      // Clear input
      setContent('');
      onCommentAdded(); // re-fetch comments
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <label
          htmlFor="content"
          style={{ display: 'block', fontWeight: 'bold' }}
        >
          Add Comment:
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}
