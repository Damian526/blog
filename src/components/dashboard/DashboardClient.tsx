'use client';

import { useState, useMemo } from 'react';
import PostList from '@/components/posts/PostList';
import PostStatusFilter from '@/components/posts/PostStatusFilter';
import UserStatusCard from '@/components/ui/UserStatusCard';
import DashboardContent from '@/components/ui/DashboardContent';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useDashboardPosts } from '@/hooks/usePosts';
import { useSession } from 'next-auth/react';
import type { PostSummary } from '@/server/api/types';
import {
  PostsSection,
  SectionTitle,
  LoadingState,
  ErrorState,
  EmptyState,
} from '@/styles/components/ui/Dashboard.styles';

interface DashboardClientProps {
  initialPosts: PostSummary[];
}

export default function DashboardClient({ initialPosts }: DashboardClientProps) {
  const { data: session } = useSession();
  const { user } = useCurrentUser();
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  
  // Use dashboard-specific hook with initial data
  const { 
    posts, 
    error, 
    isLoading, 
    refetch, 
    deletePost, 
    isDeleting 
  } = useDashboardPosts(
    { authorId: user?.id || 0 }, 
    initialPosts
  );

  // Filter posts based on status
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    
    switch (statusFilter) {
      case 'published':
        return posts.filter(post => post.published);
      case 'unpublished':
        return posts.filter(post => !post.published);
      default:
        return posts;
    }
  }, [posts, statusFilter]);

  // Calculate counts for the filter component
  const postCounts = useMemo(() => {
    if (!posts) return { all: 0, published: 0, unpublished: 0 };
    
    const published = posts.filter(post => post.published).length;
    const unpublished = posts.filter(post => !post.published).length;
    
    return {
      all: posts.length,
      published,
      unpublished
    };
  }, [posts]);

  const handleDelete = async (postId: number) => {
    try {
      await deletePost(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete the post. Please try again.');
    }
  };

  if (!session) {
    return null; // This should be handled by the parent component
  }

  return (
    <div>
      <DashboardContent session={session} />
      <UserStatusCard />
      <PostsSection>
        <SectionTitle>Your Posts</SectionTitle>
        {isLoading && !posts.length ? (
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
          <>
            <PostStatusFilter
              value={statusFilter}
              onChange={setStatusFilter}
              showCounts={postCounts}
            />
            {filteredPosts.length === 0 ? (
              <EmptyState>
                <h3>No {statusFilter === 'all' ? '' : statusFilter} posts found</h3>
                <p>
                  {statusFilter === 'published' 
                    ? "You don't have any published posts yet."
                    : statusFilter === 'unpublished'
                    ? "You don't have any unpublished posts."
                    : "No posts match the current filter."
                  }
                </p>
              </EmptyState>
            ) : (
              <PostList
                posts={filteredPosts}
                showActions={true}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            )}
          </>
        )}
      </PostsSection>
    </div>
  );
}
