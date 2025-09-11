'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { publishPost } from '@/lib/actions/admin';

export default function PublishButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePublish = async () => {
    startTransition(async () => {
      try {
        const result = await publishPost(postId);
        
        if (result.success) {
          // Once published, revalidate or refresh the page so we see updated status
          router.refresh();
        } else {
          alert(result.error || 'Error publishing post');
        }
      } catch (err) {
        console.error(err);
        alert('Error publishing post');
      }
    });
  };

  return (
    <button
      onClick={handlePublish}
      disabled={isPending}
      style={{ 
        padding: '0.5rem', 
        cursor: isPending ? 'not-allowed' : 'pointer',
        opacity: isPending ? 0.7 : 1 
      }}
    >
      {isPending ? 'Publishing...' : 'Publish'}
    </button>
  );
}
