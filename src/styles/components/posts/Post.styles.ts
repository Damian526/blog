import styled from 'styled-components';

export const PostContainer = styled.article`
  width: 100%;
  padding: 3rem 4rem;
  background: var(--background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);

  @media (max-width: 1200px) {
    padding: 3rem;
  }

  @media (max-width: 768px) {
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

export const PostTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const PostMeta = styled.div`
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-light);
`;

export const PostBody = styled.div`
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text-primary);
  max-width: none;

  /* Rich text content styling */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 2.5rem 0 1.5rem 0;
    color: var(--text-primary);
  }

  h1 {
    font-size: 2.25rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.75rem;
  }

  p {
    margin-bottom: 1.75rem;
    max-width: 75ch;
  }

  ul,
  ol {
    margin-bottom: 1.75rem;
    padding-left: 2rem;
    max-width: 75ch;
  }

  li {
    margin-bottom: 0.75rem;
  }

  blockquote {
    border-left: 4px solid var(--primary-color);
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: var(--text-secondary);
    font-size: 1.25rem;
    max-width: 70ch;
  }

  code {
    background: var(--background-tertiary);
    padding: 0.3rem 0.5rem;
    border-radius: var(--radius-sm);
    font-family: 'Courier New', monospace;
    font-size: 1rem;
  }

  pre {
    background: var(--background-tertiary);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    overflow-x: auto;
    margin: 2rem 0;

    code {
      background: none;
      padding: 0;
    }
  }

  @media (max-width: 768px) {
    font-size: 1rem;

    h1 {
      font-size: 1.75rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    h3 {
      font-size: 1.25rem;
    }

    p,
    ul,
    ol {
      max-width: none;
    }

    blockquote {
      font-size: 1.125rem;
      max-width: none;
    }
  }
`;
