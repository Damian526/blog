'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import DashboardContent from '@/components/ui/DashboardContent';
import LoginForm from '@/components/auth/LoginForm';
import Modal from '@/components/ui/Modal';
import PostList from '@/components/posts/PostList';
import {
  PostsSection,
  SectionTitle,
  LoadingState,
  ErrorState,
  EmptyState,
  UnauthenticatedMessage,
} from '@/styles/components/ui/Dashboard.styles';

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
              <p>
                You haven't created any posts yet. Start writing your first post
                to share your knowledge with the community!
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
