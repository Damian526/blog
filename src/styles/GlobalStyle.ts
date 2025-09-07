'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --font-size-base: 16px;
    --font-small: 0.875rem;
    --font-medium: 1rem;
    --font-large: 1.25rem;
    --font-xl: 1.5rem;
    --font-xxl: 2rem;
    
    /* Responsive breakpoints */
    --breakpoint-xs: 480px;
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
    
    /* Modern color palette */
    --primary-color: #2563eb;
    --primary-hover: #1d4ed8;
    --primary-light: #3b82f6;
    --primary-dark: #1e40af;
    --secondary-color: #64748b;
    --accent-color: #06b6d4;
    --success-color: #10b981;
    --success-light: #34d399;
    --success-dark: #059669;
    --warning-color: #f59e0b;
    --warning-light: #fbbf24;
    --warning-dark: #d97706;
    --error-color: #ef4444;
    --error-light: #f87171;
    --error-dark: #dc2626;
    --info-color: #06b6d4;
    --info-light: #22d3ee;
    --info-dark: #0891b2;
    
    /* Neutral colors */
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    --text-muted: #94a3b8;
    --text-light: #cbd5e1;
    --background: #ffffff;
    --background-secondary: #f8fafc;
    --background-tertiary: #f1f5f9;
    --background-dark: #0f172a;
    --border-color: #e2e8f0;
    --border-light: #f1f5f9;
    --border-dark: #334155;
    
    /* Semantic colors with transparency */
    --primary-bg: rgba(37, 99, 235, 0.1);
    --primary-border: rgba(37, 99, 235, 0.2);
    --success-bg: rgba(16, 185, 129, 0.1);
    --success-border: rgba(16, 185, 129, 0.2);
    --warning-bg: rgba(245, 158, 11, 0.1);
    --warning-border: rgba(245, 158, 11, 0.2);
    --error-bg: rgba(239, 68, 68, 0.1);
    --error-border: rgba(239, 68, 68, 0.2);
    --info-bg: rgba(6, 182, 212, 0.1);
    --info-border: rgba(6, 182, 212, 0.2);
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    
    /* Border radius */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    
    /* Spacing */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;
    
    /* Responsive spacing */
    --space-responsive-sm: clamp(0.5rem, 2vw, 1rem);
    --space-responsive-md: clamp(1rem, 3vw, 1.5rem);
    --space-responsive-lg: clamp(1.5rem, 4vw, 2rem);
    --space-responsive-xl: clamp(2rem, 5vw, 3rem);
  }

  /* Responsive font sizes */
  @media (max-width: 768px) {
    :root {
      --font-size-base: 14px;
      --font-small: 0.75rem;
      --font-medium: 0.875rem;
      --font-large: 1rem;
      --font-xl: 1.25rem;
      --font-xxl: 1.5rem;
    }
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-size: var(--font-size-base);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    margin: 0;
    padding: 0;
    color: var(--text-primary);
    background-color: var(--background-secondary);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden; /* Prevent horizontal scroll */
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin: 0;
    color: var(--text-primary);
  }

  h1 { 
    font-size: var(--font-xxl);
    @media (max-width: 768px) {
      font-size: var(--font-xl);
    }
  }
  h2 { 
    font-size: var(--font-xl);
    @media (max-width: 768px) {
      font-size: var(--font-large);
    }
  }
  h3 { 
    font-size: var(--font-large);
    @media (max-width: 768px) {
      font-size: var(--font-medium);
    }
  }

  p {
    margin: 0;
    line-height: 1.6;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: var(--primary-hover);
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
  }

  input, textarea, select {
    font-family: inherit;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--space-sm) var(--space-md);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
    max-width: 100%;
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
  }

  /* Responsive utilities */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-responsive-md);
  }

  .hide-mobile {
    @media (max-width: 768px) {
      display: none !important;
    }
  }

  .show-mobile {
    display: none !important;
    @media (max-width: 768px) {
      display: block !important;
    }
  }

  .show-mobile-flex {
    display: none !important;
    @media (max-width: 768px) {
      display: flex !important;
    }
  }

  /* Editor styles */
  .editor-toolbar button {
    background: var(--background);
    border: 1px solid var(--border-color);
    padding: var(--space-xs) var(--space-sm);
    margin-right: var(--space-xs);
    cursor: pointer;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-size: var(--font-small);
    transition: all 0.2s ease;
  }

  .editor-toolbar button:hover {
    background: var(--background-tertiary);
    border-color: var(--primary-color);
    color: var(--text-primary);
  }

  .editor-content:focus {
    outline: none;
  }

  .ProseMirror {
    outline: none;
    padding: var(--space-lg);
    min-height: 200px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--background);
    color: var(--text-primary);
    line-height: 1.6;
    
    @media (max-width: 768px) {
      padding: var(--space-md);
      min-height: 150px;
    }
  }

  .ProseMirror:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
  }

  .ProseMirror p:first-child { margin-top: 0; }
  .ProseMirror p:last-child { margin-bottom: 0; }

  /* Ensure all images in the editor are responsive and contained */
  .ProseMirror img {
    max-width: 100% !important;
    height: auto !important;
    border-radius: var(--radius-lg);
    margin: var(--space-md) 0;
    box-shadow: var(--shadow-md);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: block;
    
    /* Ensure images don't break out of container */
    box-sizing: border-box;
    object-fit: contain;
  }

  .ProseMirror img:hover {
    transform: scale(1.02);
    box-shadow: var(--shadow-lg);
  }

  /* Mobile-specific image constraints */
  @media (max-width: 768px) {
    .ProseMirror img {
      max-width: calc(100vw - 32px) !important;
      margin: var(--space-sm) auto;
      transform: none !important; /* Disable hover effects on mobile */
    }
    
    .ProseMirror img:hover {
      transform: none;
      box-shadow: var(--shadow-md);
    }
  }

  .toolbar-btn {
    background: var(--background-tertiary);
    border: 1px solid var(--border-color);
    padding: var(--space-xs) var(--space-sm);
    cursor: pointer;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    transition: all 0.2s ease;
  }

  .toolbar-btn:hover {
    background: var(--background);
    border-color: var(--primary-color);
    color: var(--text-primary);
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--background-tertiary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: var(--radius-sm);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
  }

  /* Mobile touch improvements */
  @media (max-width: 768px) {
    button, a, input, select, textarea {
      min-height: 44px; /* Minimum touch target size */
    }
    
    /* Improve tap targets */
    button {
      padding: var(--space-sm) var(--space-md);
    }
  }
`;

export default GlobalStyle;
