'use client';

import PostContent from '@/components/blog/PostContent';
import CommentsSection from '@/components/comments/CommentsSection';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
  };
}

export default function SinglePostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`, { cache: 'no-store' });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch post');
        }
        const postData = await res.json();
        setPost(postData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PostContent post={post} />
      <CommentsSection postId={post.id} />
    </div>
  );
}
