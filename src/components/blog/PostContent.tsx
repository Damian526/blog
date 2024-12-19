'use client';

import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Content = styled.div`
  line-height: 1.6;
`;

export default function PostContent({
  post,
}: {
  post: { title: string; content: string };
}) {
  return (
    <Container>
      <Title>{post.title}</Title>
      <Content dangerouslySetInnerHTML={{ __html: post.content }} />
    </Container>
  );
}
