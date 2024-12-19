'use client';

import styled from 'styled-components';
import PostCard from './PostCard';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

export default function PostList({ posts }: { posts: any[] }) {
  return (
    <Container>
      <Title>Welcome to the Blog</Title>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Container>
  );
}
