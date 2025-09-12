'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostForm from '@/components/posts/PostForm';
import { usePost } from '@/hooks/usePost';

interface Category {
  id: number;
  name: string;
  subcategories: Array<{
    id: number;
    name: string;
    categoryId: number;
  }>;
}

interface EditPostClientProps {
  categories: Category[];
}

export default function EditPostClient({ categories }: EditPostClientProps) {
  const params = useParams();
  const [isClient, setIsClient] = useState(false);
  const [postId, setPostId] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (params.id) {
      const id = parseInt(params.id as string);
      if (!isNaN(id)) {
        setPostId(id);
      }
    }
  }, [params.id]);

  const {
    post,
    error: postError,
    isLoading: postLoading,
  } = usePost(isClient ? postId : null);

  const isLoading = postLoading;
  const error = postError;

  if (!isClient || isLoading) return <p>Loading…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Edit Post</h1>
      <PostForm post={post} categories={categories} />
    </div>
  );
}
