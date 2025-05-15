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
  .editor-toolbar button {
  background: white;
  border: 1px solid #ccc;
  padding: 4px 8px;
  margin-right: 4px;
  cursor: pointer;
}
.editor-toolbar button:hover {
  background: #f0f0f0;
}

.editor-content:focus {
  outline: none;
}
.ProseMirror {
  outline: none;           /* no black border */
  padding: 8px;
  min-height: 180px;       /* blank canvas */
}

.ProseMirror p:first-child { margin-top: 0; }   /* kill top margin */
.ProseMirror p:last-child  { margin-bottom: 0; }

.toolbar-btn {
  background: #f5f5f5;
  border: 1px solid #ccc;
  padding: 4px 8px;
  cursor: pointer;
}
.toolbar-btn:hover { background: #eaeaea; }
`;

export default GlobalStyle;
