// app/posts/[id]/page.tsx  (or wherever your SinglePostPage lives)
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RichText from '@/components/common/RichText';
import CommentsSection from '@/components/comments/CommentsSection';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: { name: string };
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
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch post');
        setPost(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchPost();
  }, [id]);

  if (loading) return <p>Loading post…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <article style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <h1>{post.title}</h1>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>
        By {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {/* ← Here’s your rich‐text render */}
      <RichText html={post.content} />

      <CommentsSection postId={post.id} />
    </article>
  );
}
