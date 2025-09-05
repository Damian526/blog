'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/server/api';

export default function PublishButton({ postId }: { postId: number }) {
  const router = useRouter();

  const handlePublish = async () => {
    try {
      await api.admin.publishPost(postId);
      
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
