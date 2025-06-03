'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import DashboardContent from '@/components/ui/DashboardContent';
import LoginForm from '@/components/auth/LoginForm';
import Modal from '@/components/ui/Modal';
import PostList from '@/components/posts/PostList';
import UserStatusCard from '@/components/ui/UserStatusCard';
import {
  PostsSection,
  SectionTitle,
  LoadingState,
  ErrorState,
  EmptyState,
  UnauthenticatedMessage,
} from '@/styles/components/ui/Dashboard.styles';

// Custom fetcher for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch');
  }
  return response.json();
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle authentication redirect on client side
  useEffect(() => {
    if (isClient && status === 'unauthenticated') {
      setShowLoginModal(true);
    }
  }, [status, isClient]);

  const {
    data: posts,
    error,
    isLoading,
    mutate,
  } = useSWR(
    // Only fetch if we have a session and are on client side
    isClient && session ? '/api/user/posts' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
    },
  );

  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete the post.');
      }

      // Revalidate the posts list
      mutate();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete the post. Please try again.');
    }
  };

  // Show loading state during initial client-side render
  if (!isClient || status === 'loading') {
    return <LoadingState>Loading dashboard...</LoadingState>;
  }

  // Show dashboard content if user is authenticated
  if (session) {
    return (
      <div>
        <DashboardContent session={session} />
        <UserStatusCard />
        <PostsSection>
          <SectionTitle>Your Posts</SectionTitle>
          {isLoading ? (
            <LoadingState>Loading your posts...</LoadingState>
          ) : error ? (
            <ErrorState>Error fetching posts: {error.message}</ErrorState>
          ) : !posts || posts.length === 0 ? (
            <EmptyState>
              <h3>No posts yet</h3>
              <p>
                You haven&apos;t created any posts yet. Start writing your first
                post to share your knowledge with the community!
              </p>
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
