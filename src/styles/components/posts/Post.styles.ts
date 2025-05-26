import styled from 'styled-components';

export const PostContainer = styled.article`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
`;

export const PostTitle = styled.h1`
  font-size: var(--font-xxl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.2;
`;

export const PostMeta = styled.div`
  font-size: var(--font-small);
  color: var(--text-secondary);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
`;

export const PostBody = styled.div`
  font-size: var(--font-medium);
  line-height: 1.7;
  color: var(--text-primary);
  
  /* Rich text content styling */
  h1, h2, h3, h4, h5, h6 {
    margin: 2rem 0 1rem 0;
    color: var(--text-primary);
  }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  blockquote {
    border-left: 4px solid var(--primary-color);
    padding-left: 1rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: var(--text-secondary);
  }
  
  code {
    background: var(--background-tertiary);
    padding: 0.2rem 0.4rem;
    border-radius: var(--radius-sm);
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }
  
  pre {
    background: var(--background-tertiary);
    padding: 1rem;
    border-radius: var(--radius-md);
    overflow-x: auto;
    margin: 1.5rem 0;
    
    code {
      background: none;
      padding: 0;
    }
  }
`; 