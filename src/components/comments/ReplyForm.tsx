'use client';

import { useState } from 'react';

interface ReplyFormProps {
  postId: number;
  parentId: number;
  onReplyAdded: () => void;
}

export default function ReplyForm({
  postId,
  parentId,
  onReplyAdded,
}: ReplyFormProps) {
  const [replyContent, setReplyContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!replyContent) {
      setError('Reply content is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/comments/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent, postId, parentId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post reply');
      }

      setReplyContent('');
      onReplyAdded(); // Refresh comments after posting
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: '10px', marginLeft: '20px' }}
    >
      <div>
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          rows={2}
          placeholder="Write a reply..."
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{ marginTop: '5px' }}
      >
        {isSubmitting ? 'Posting...' : 'Reply'}
      </button>
    </form>
  );
}
