'use client';

import PostCard from './PostCard';
import {
  Container,
  PostsGrid,
  EmptyState,
} from '@/styles/components/posts/PostList.styles';

// Interfaces
interface Author {
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content?: string;
  published: boolean;
  createdAt: string; // ISO string
  author: Author;
}

interface PostListProps {
  posts: Post[];
  showActions?: boolean;
  onDelete?: (postId: number) => Promise<void>;
}

export default function PostList({
  posts,
  showActions,
  onDelete,
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
