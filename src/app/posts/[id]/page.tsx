'use client';

import { notFound } from 'next/navigation';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import PostContent from '@/components/posts/PostContent';
import CommentsSection from '@/components/comments/CommentsSection';

const PageContainer = styled.div`
  max-width: 95vw;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 2rem;
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 1rem 1rem;
    max-width: 98vw;
  }
  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
    max-width: 100vw;
  }
`;

const PostWrapper = styled.div`
  margin-bottom: 3rem;
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 1rem;
`;

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  author: {
    name: string | null;
    email: string;
  };
  _count: {
    comments: number;
  };
}

// This is now a Client Component
export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [postId, setPostId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        if (isNaN(id)) {
          setError(true);
          setLoading(false);
          return;
        }

        setPostId(id);

        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        const postData = await response.json();
        setPost(postData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(true);
        setLoading(false);
      }
    }

    fetchPost();
  }, [params]);

  if (loading) {
    return (
      <PageContainer>
        <LoadingMessage>Loading post...</LoadingMessage>
      </PageContainer>
    );
  }

  if (error || !post || !postId) {
    notFound();
  }

  return (
    <PageContainer>
      <PostWrapper>
        <PostContent post={post} />
      </PostWrapper>
      <CommentsSection postId={postId} />
    </PageContainer>
  );
}
