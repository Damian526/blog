'use client';

import { useEffect, useState } from 'react';
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
    author?: {
      // Make author optional
      name: string;
    };
    createdAt: string;
  };
}

export default function PostContent({ post }: PostContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedDate = mounted
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <PostContainer>
      <Title>{post?.title}</Title>
      <Author>
        {post?.author?.name ? `By ${post.author.name}` : 'Anonymous'}
        {mounted && formattedDate && <span> on {formattedDate}</span>}
      </Author>
      <Content>{post?.content}</Content>
    </PostContainer>
  );
}
