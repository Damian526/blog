'use client';

import styled from 'styled-components';
import PostCard from './PostCard';

// Styled Components
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
`;

const PostsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
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
  }
`;

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
