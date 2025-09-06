/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('string-strip-html', () => ({
  stripHtml: jest.fn(() => ({ result: 'mocked text' })),
}));

jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

// ✅ THE WORKING MOCK - Use Proxy to handle any styled component
jest.mock('@/styles/components/posts/PostCard.styles', () => {
  return new Proxy(
    {},
    {
      get(target, prop) {
        // Return a mock component for ANY property name
        return function MockStyledComponent({ children, ...props }: any) {
          console.log(
            `Rendering mock for styled component: ${prop.toString()} and children: ${children}`,
          );
          
          // Filter out styled-components specific props (starting with $)
          const cleanProps = Object.entries(props).reduce((acc, [key, value]) => {
            if (!key.startsWith('$')) {
              acc[key] = value;
            }
            return acc;
          }, {} as any);
          
          return React.createElement(
            'div',
            {
              'data-component': prop.toString(),
              ...cleanProps,
            },
            children,
          );
        };
      },
    },
  );
});

describe('PostCard Component - Working Tests', () => {
  const mockPost = {
    id: 1,
    title: 'How to Learn React in 2024',
    content: 'A comprehensive guide to learning React from scratch.',
    published: true,
    createdAt: '2024-01-15T10:00:00Z',
    author: {
      id: 1,
      name: 'Jane Developer',
      email: 'jane@example.com',
      image: 'https://example.com/jane.jpg',
    },
    subcategories: [
      {
        id: 1,
        name: 'React',
        category: {
          id: 1,
          name: 'Frontend',
        },
      },
    ],
  };

  // Import AFTER mocks are set up
  const PostCard = require('@/components/posts/PostCard').default;

  // TEST 1: Component renders successfully
  it('renders without crashing', () => {
    console.log('🧪 Testing PostCard rendering...');

    expect(() => {
      render(<PostCard post={mockPost} />);
    }).not.toThrow();

    console.log('✅ PostCard rendered successfully!');
  });

  // TEST 2: Displays post title
  it('displays the post title', () => {
    console.log('🧪 Testing title display...');

    render(<PostCard post={mockPost} />);

    console.log('📝 Looking for title...');
    const titleElement = screen.getByText('How to Learn React in 2024');
    expect(titleElement).toBeInTheDocument();

    console.log('✅ Title found and displayed!');
  });

  // TEST 3: Displays author name
  it('displays the author name', () => {
    console.log('🧪 Testing author display...');

    render(<PostCard post={mockPost} />);

    console.log('📝 Looking for author...');
    const authorElement = screen.getByText('Jane Developer');
    expect(authorElement).toBeInTheDocument();

    console.log('✅ Author name found and displayed!');
  });

  // TEST 4: Displays category
  it('displays the category', () => {
    console.log('🧪 Testing category display...');

    render(<PostCard post={mockPost} />);

    console.log('📝 Looking for category...');
    const categoryElement = screen.getByText('React');
    expect(categoryElement).toBeInTheDocument();

    console.log('✅ Category found and displayed!');
  });

  // TEST 5: Shows rendered HTML structure
  it('shows the complete HTML structure', () => {
    console.log('🧪 Testing full HTML structure...');

    const { container } = render(<PostCard post={mockPost} />);

    console.log('📝 Complete HTML output:');
    console.log(container.innerHTML);

    // Check that main container exists
    expect(container.firstChild).toBeInTheDocument();

    console.log('✅ HTML structure is complete!');
  });

  // TEST 6: Handles showActions prop
  it('handles showActions prop', () => {
    const mockOnDelete = jest.fn();

    const { container } = render(
      <PostCard post={mockPost} showActions={true} onDelete={mockOnDelete} />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
