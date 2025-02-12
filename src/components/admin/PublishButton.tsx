'use client';

import { useRouter } from 'next/navigation';

export default function PublishButton({ postId }: { postId: number }) {
  const router = useRouter();

  const handlePublish = async () => {
    try {
      const res = await fetch('/api/admin/posts/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) {
        throw new Error('Failed to publish post');
      }

      // Once published, revalidate or refresh the page so we see updated status
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Error publishing post');
    }
  };

  return (
    <button
      onClick={handlePublish}
      style={{ padding: '0.5rem', cursor: 'pointer' }}
    >
      Publish
    </button>
  );
}
