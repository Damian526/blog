'use client';

import useSWR from 'swr';
import styled from 'styled-components';
import { useState } from 'react';

// Styled components
const CommentsContainer = styled.div`
  margin-top: 30px;
`;

const CommentItem = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Author = styled.p`
  font-size: 0.9rem;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Content = styled.p`
  font-size: 1rem;
  line-height: 1.4;
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
  console.log(postId);
  if (isLoading) return <p>Loading comments...</p>;
  if (error) return <p>Failed to load comments</p>;

  return (
    <CommentsContainer>
      <h2>Comments</h2>
      {/* Render each comment */}
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem key={comment.id}>
            <Author>
              {comment.author.name} —{' '}
              {new Date(comment.createdAt).toLocaleDateString()}
            </Author>
            <Content>{comment.content}</Content>
          </CommentItem>
        ))
      ) : (
        <p>No comments yet.</p>
      )}

      {/* Add comment form below */}
      <AddCommentForm postId={postId} onCommentAdded={() => mutate()} />
    </CommentsContainer>
  );
}

// We'll define the AddCommentForm here (or in a separate file).
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
