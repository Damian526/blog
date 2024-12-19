'use client';

import styled from 'styled-components';

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
}

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const PostCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition: box-shadow 0.3s ease;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 8px;
`;

const Info = styled.p`
  margin: 4px 0;
  font-size: 0.9rem;
  color: #555;

  strong {
    color: #0070f3;
  }
`;

export default function PostList({ posts }: PostListProps) {
  return (
    <Container>
      {posts.map((post) => (
        <PostCard key={post.id}>
          <Title>{post.title}</Title>
          <Info>
            <strong>Author:</strong> {post.author.name} ({post.author.email})
          </Info>
          <Info>
            <strong>Published:</strong> {post.published ? 'Yes' : 'No'}
          </Info>
          <Info>
            <strong>Content:</strong> {post.content || 'No content available'}
          </Info>
          <Info>
            <strong>Created At:</strong> {post.createdAt}
          </Info>
        </PostCard>
      ))}
    </Container>
  );
}
