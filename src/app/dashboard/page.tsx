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
const PostsSection = styled.div`
  background: var(--background);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-xl);
  font-weight: 600;
  margin: 0 0 var(--space-lg) 0;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  &::before {
    content: '📝';
    font-size: var(--font-large);
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-secondary);
  font-size: var(--font-medium);
`;

const ErrorState = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  color: var(--error-color);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-md);
  font-size: var(--font-medium);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-secondary);
  
  h3 {
    font-size: var(--font-xl);
    margin-bottom: var(--space-md);
    color: var(--text-primary);
  }
  
  p {
    font-size: var(--font-medium);
    line-height: 1.6;
    margin-bottom: var(--space-lg);
  }
`;

const UnauthenticatedMessage = styled.div`
  text-align: center;
  margin-top: var(--space-2xl);
  padding: var(--space-xl);
  background: var(--background);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: var(--font-large);
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
    return <LoadingState>Loading session...</LoadingState>;
  }

  // Show dashboard content if user is authenticated
  if (session) {
    return (
      <div>
        <DashboardContent session={session} />
        <PostsSection>
          <SectionTitle>Your Posts</SectionTitle>
          {isLoading ? (
            <LoadingState>Loading your posts...</LoadingState>
          ) : error ? (
            <ErrorState>Error fetching posts: {error.message}</ErrorState>
          ) : posts?.length === 0 ? (
            <EmptyState>
              <h3>No posts yet</h3>
              <p>You haven't created any posts yet. Start writing your first post to share your knowledge with the community!</p>
            </EmptyState>
          ) : (
            <PostList
              posts={posts}
              showActions={true}
              onDelete={handleDelete}
            />
          )}
        </PostsSection>
      </div>
    );
  }

  // If not authenticated, show login modal and fallback message
  return (
    <>
      <UnauthenticatedMessage>
        Please login to access the dashboard.
      </UnauthenticatedMessage>

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginForm />
      </Modal>
    </>
  );
}
