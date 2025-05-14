'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostForm from '@/components/posts/PostForm';

interface Category {
  id: number;
  name: string;
  subcategories: { id: number; name: string }[];
}

interface Post {
  id: string;
  title: string;
  content: string;
}

export default function EditPostPage() {
  const params = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      const API = process.env.NEXT_PUBLIC_API_URL;
      try {
        // fetch post and categories in parallel
        const [postRes, catRes] = await Promise.all([
          fetch(`${API}/api/posts/${params.id}`),
          fetch(`${API}/api/categories`),
        ]);

        if (!postRes.ok) {
          const err = await postRes.json();
          throw new Error(err.error || 'Failed to fetch post.');
        }
        if (!catRes.ok) {
          const err = await catRes.json();
          throw new Error(err.message || 'Failed to fetch categories.');
        }

        const postData: Post = await postRes.json();
        const cats: Category[] = await catRes.json();

        setPost(postData);
        setCategories(cats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return <p>Post not found.</p>;

  // pass both post and categories into the form:
  return <PostForm post={post} categories={categories} />;
}
