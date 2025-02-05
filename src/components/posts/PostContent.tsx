'use client';

import styled from 'styled-components';

const PostContainer = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const Author = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 20px;
`;

const Content = styled.div`
  font-size: 1rem;
  line-height: 1.6;
`;

interface PostContentProps {
  post: {
    id: number;
    title: string;
    content: string;
    author: {
      name: string;
    };
    createdAt: string;
  };
}

export default function PostContent({ post }: PostContentProps) {
  return (
    <PostContainer>
      <Title>{post.title}</Title>
      <Author>
        By {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}
      </Author>
      <Content>{post.content}</Content>
    </PostContainer>
  );
}
