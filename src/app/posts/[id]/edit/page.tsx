'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostForm from '@/components/posts/PostForm';
import { useCategories } from '@/hooks/useCategories';
import { usePost } from '@/hooks/usePost';

export default function EditPostPage() {
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

  const {
    categories,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategories();

  const isLoading = postLoading || categoriesLoading;
  const error = postError || categoriesError;

  if (!isClient || isLoading) return <p>Loading…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;
  if (!post) return <p>Post not found.</p>;
  if (!categories.length) return <p>Categories not found.</p>;

  return <PostForm post={post} categories={categories} />;
}
