'use client';

import Link from 'next/link';
import styled from 'styled-components';

const Card = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Title = styled.h2`
  margin: 0 0 10px;
  font-size: 1.5rem;
`;

const Excerpt = styled.p`
  color: #666;
  margin: 0;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #0070f3;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
    color: #005bb5;
  }
`;

export default function PostCard({
  post,
}: {
  post: { id: number; title: string; excerpt: string; slug: string };
}) {
  return (
    <Card>
      <Title>{post.title}</Title>
      <Excerpt>{post.excerpt}</Excerpt>
      <StyledLink href={`/posts/${post.slug}`}>Read More</StyledLink>
    </Card>
  );
}
