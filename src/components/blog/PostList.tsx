'use client';

import styled from 'styled-components';
import PostCard from './PostCard';

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
  editable: boolean;
}

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

export default function PostList({ posts, editable }: PostListProps) {
  return (
    <Container>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} editable={editable} />
      ))}
    </Container>
  );
}
