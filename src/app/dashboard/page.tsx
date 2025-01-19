'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import DashboardContent from '@/components/ui/DashboardContent';
import LoginForm from '@/components/auth/LoginForm';
import Modal from '@/components/ui/Modal';
import styled from 'styled-components';
import Link from 'next/link';

// Styled Components
const PostsContainer = styled.div`
  margin-top: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const PostItem = styled.div`
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const Content = styled.p`
  font-size: 1rem;
  line-height: 1.6;
`;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Automatically show login modal if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      setShowLoginModal(true);
    }
  }, [status]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  // Fetch user posts using SWR
  const {
    data: posts,
    error,
    isLoading,
  } = useSWR(
    session ? `${API_BASE_URL}/api/user/posts` : null, // Only fetch if session exists
    fetcher,
  );

  // Show loading indicator while session is being fetched
  if (status === 'loading') {
    return <p>Loading session...</p>;
  }

  // Show dashboard content if user is authenticated
  if (session) {
    return (
      <div>
        <DashboardContent session={session} />
        <PostsContainer>
          <h1>Your Posts</h1>
          {isLoading ? (
            <p>Loading your posts...</p>
          ) : error ? (
            <p>Error fetching posts: {error.message}</p>
          ) : posts?.length === 0 ? (
            <p>You don&apos;t have any posts yet.</p>
          ) : (
            posts.map((post: any) => (
              <PostItem key={post.id}>
                <Title>{post.title}</Title>
                <Content>{post.content || 'No content available'}</Content>
                <p>
                  <strong>Published:</strong> {post.published ? 'Yes' : 'No'}
                </p>
                <p>
                  <strong>Created At:</strong>{' '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <Link href={`/posts/${post.id}/edit`}>
                  <button>Edit</button>
                </Link>
              </PostItem>
            ))
          )}
        </PostsContainer>
      </div>
    );
  }

  // If not authenticated, show login modal and fallback message
  return (
    <>
      <p style={{ textAlign: 'center', marginTop: '40px' }}>
        Please login to access the dashboard.
      </p>

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginForm />
      </Modal>
    </>
  );
}
