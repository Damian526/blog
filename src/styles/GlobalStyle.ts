'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --font-size-base: 16px;
    --font-small: 0.875rem;
    --font-medium: 1rem;
    --font-large: 1.25rem;
    --primary-color: #3498db;
    --text-color: #333;
  }

  body {
    font-size: var(--font-size-base);
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    color: var(--text-color);
  }
`;

export default GlobalStyle;
