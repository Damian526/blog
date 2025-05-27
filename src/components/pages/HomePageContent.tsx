'use client';

import styled from 'styled-components';
import PostList from '@/components/posts/PostList';

const PageHeader = styled.header`
  padding: var(--space-responsive-xl) 0;
  text-align: center;
  background: linear-gradient(
    135deg,
    var(--background) 0%,
    var(--background-tertiary) 100%
  );
  border-bottom: 1px solid var(--border-light);
  margin-bottom: var(--space-responsive-lg);

  h1 {
    font-size: var(--font-xxl);
    font-weight: 700;
    margin-bottom: var(--space-md);
    background: linear-gradient(
      135deg,
      var(--primary-color),
      var(--accent-color)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 768px) {
      font-size: var(--font-xl);
      margin-bottom: var(--space-sm);
    }

    @media (max-width: 480px) {
      font-size: var(--font-large);
    }
  }

  p {
    font-size: var(--font-large);
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: var(--font-medium);
      padding: 0 var(--space-md);
    }

    @media (max-width: 480px) {
      font-size: var(--font-small);
    }
  }

  @media (max-width: 768px) {
    padding: var(--space-xl) 0;
    margin-bottom: var(--space-lg);
  }

  @media (max-width: 480px) {
    padding: var(--space-lg) 0;
    margin-bottom: var(--space-md);
  }
`;

const ErrorMessage = styled.div`
  padding: var(--space-responsive-xl);
  text-align: center;
  color: var(--error-color);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-lg);
  margin: var(--space-responsive-lg) auto;
  max-width: 600px;

  @media (max-width: 768px) {
    margin: var(--space-lg) var(--space-md);
    padding: var(--space-lg);
  }
`;

interface HomePageContentProps {
  posts: any[];
  error: string | null;
}

export default function HomePageContent({
  posts,
  error,
}: HomePageContentProps) {
  return (
    <div>
      <PageHeader>
        <h1>WebDevSphere</h1>
        <p>Discover the latest articles about web development</p>
      </PageHeader>

      {/* Server-rendered posts with error handling */}
      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <PostList posts={posts} showActions={false} />
      )}
    </div>
  );
}
