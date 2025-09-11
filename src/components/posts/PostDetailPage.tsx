'use client';

import styled from 'styled-components';
import PostContent from '@/components/posts/PostContent';
import CommentsSection from '@/components/comments/CommentsSection';
import type { PostSummary } from '@/server/api/types';

const PageContainer = styled.div`
  max-width: 95vw;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 2rem;
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 1rem 1rem;
    max-width: 98vw;
  }
  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
    max-width: 100vw;
  }
`;

const PostWrapper = styled.div`
  margin-bottom: 3rem;
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

interface PostDetailPageProps {
  post: PostSummary;
  postId: number;
}

export default function PostDetailPage({ post, postId }: PostDetailPageProps) {
  return (
    <PageContainer>
      <PostWrapper>
        <PostContent post={post} />
      </PostWrapper>
      <CommentsSection postId={postId} />
    </PageContainer>
  );
}
