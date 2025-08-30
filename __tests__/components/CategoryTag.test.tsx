/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CategoryTag } from '@/styles/components/posts/PostCard.styles';

describe('CategoryTag Component', () => {

  it('displays the category name', () => {
    render(<CategoryTag color="#3b82f6">React</CategoryTag>);

    const categoryText = screen.getByText('React');
    expect(categoryText).toBeInTheDocument();
  });
});
