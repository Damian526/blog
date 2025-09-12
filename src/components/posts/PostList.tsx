'use client';

import PostCard from './PostCard';
import { PostSummary } from '@/server/api';
import {
  Container,
  PostsGrid,
  EmptyState,
} from '@/styles/components/posts/PostList.styles';

interface PostListProps {
  posts: PostSummary[];
  showActions?: boolean;
  onDelete?: (postId: number) => Promise<void>;
  isDeleting?: boolean;
}

export default function PostList({
  posts,
  showActions,
  onDelete,
  isDeleting,
}: PostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <Container>
        <EmptyState>
          <h3>No posts found</h3>
          <p>There are no posts to display at the moment. Check back later for new content!</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <PostsGrid>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            showActions={showActions}
            onDelete={onDelete}
          />
        ))}
      </PostsGrid>
    </Container>
  );
}
