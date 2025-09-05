import { useState } from 'react';
import { api } from '@/server/api';
import {
  FormContainer,
  FormLabel,
  FormTextarea,
  FormButton,
  ErrorMessage,
} from '@/components/ui/forms/FormComponents';

interface AddCommentFormProps {
  postId: number;
  onCommentAdded: () => void;
}

export default function AddCommentForm({
  postId,
  onCommentAdded,
}: AddCommentFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!content.trim()) {
      setError('Comment content is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      await api.comments.create({
        content: content.trim(),
        postId,
      });

      setContent('');
      onCommentAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to create comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit} style={{ marginTop: '2.5rem' }}>
      <FormLabel htmlFor="content">Add Comment:</FormLabel>
      <FormTextarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
        disabled={isSubmitting}
        style={{ minHeight: '120px', marginBottom: '1.25rem' }}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <FormButton
        type="submit"
        disabled={isSubmitting}
        style={{ width: '100%' }}
      >
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </FormButton>
    </FormContainer>
  );
}
