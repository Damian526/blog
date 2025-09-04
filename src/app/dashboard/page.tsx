'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import DashboardContent from '@/components/ui/DashboardContent';
import LoginForm from '@/components/auth/LoginForm';
import Modal from '@/components/ui/Modal';
import PostList from '@/components/posts/PostList';
import UserStatusCard from '@/components/ui/UserStatusCard';
import { useCurrentUser, usePostsByAuthor } from '@/hooks';
import { api } from '@/server/api';
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
  const [isClient, setIsClient] = useState(false);
  
  // Use our centralized hooks
  const { user } = useCurrentUser();
  const { posts, error, isLoading, mutate } = usePostsByAuthor(
    user?.id || 0,
    { enabled: !!user?.id }
  );

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

  const handleDelete = async (postId: number) => {
    try {
      await api.posts.delete(postId);
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
