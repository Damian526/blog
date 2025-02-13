'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import DashboardContent from '@/components/ui/DashboardContent';
import LoginForm from '@/components/auth/LoginForm';
import Modal from '@/components/ui/Modal';
import styled from 'styled-components';
import PostList from '@/components/posts/PostList';

// Styled Components
const PostsContainer = styled.div`
  margin-top: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

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

  const {
    data: posts,
    error,
    isLoading,
    mutate,
  } = useSWR(
    session ? `${API_BASE_URL}/api/user/posts` : null, // Only fetch if session exists
  );
  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete the post.');
      }

      // Optimistically update the UI by revalidating SWR cache
      mutate();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete the post. Please try again.');
    }
  };
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
            <PostList
              posts={posts}
              showActions={true}
              onDelete={handleDelete}
            />
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
