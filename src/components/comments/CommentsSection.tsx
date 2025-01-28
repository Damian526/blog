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
  justify-content: space-between;
  align-items: center;
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

  return (
    <CommentsContainer>
      <h2>Comments</h2>
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem key={comment.id}>
            <div>
              <Author>
                {comment.author.name} —{' '}
                {new Date(comment.createdAt).toLocaleDateString()}
              </Author>
              <Content>{comment.content}</Content>
            </div>
            {/* Render the delete button only if the current user created the comment */}
            {currentUserEmail === comment.author.email && (
              <button onClick={() => handleDelete(comment.id)}>Delete</button>
            )}
          </CommentItem>
        ))
      ) : (
        <p>No comments yet.</p>
      )}

      <AddCommentForm postId={postId} onCommentAdded={() => mutate()} />
    </CommentsContainer>
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
