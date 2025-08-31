/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock the hooks
jest.mock('@/hooks/useCurrentUser', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/hooks/useComments', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

import Comments from '@/components/comments/Comment';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import useComments from '@/hooks/useComments';

// Mock data
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  image: 'https://example.com/avatar.jpg',
};

const mockComments = [
  {
    id: 1,
    content: 'Great article! Really helpful.',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    author: {
      name: 'Alice Smith',
      email: 'alice@example.com',
      image: 'https://example.com/alice.jpg',
    },
    postId: 1,
  },
  {
    id: 2,
    content: 'I disagree with some points, but overall good content.',
    createdAt: new Date('2024-01-15T11:30:00Z'),
    author: {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      image: null,
    },
    postId: 1,
  },
];

describe('Comments Component - Advanced Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let mockAddComment: jest.Mock;
  let mockDeleteComment: jest.Mock;
  let mockMutate: jest.Mock;

  beforeEach(() => {
    user = userEvent.setup({ delay: null });

    // Mock functions
    mockAddComment = jest.fn();
    mockDeleteComment = jest.fn();
    mockMutate = jest.fn();

    // Default mock implementations
    (useCurrentUser as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoggedIn: true,
      isLoading: false,
    });

    (useComments as jest.Mock).mockReturnValue({
      comments: mockComments,
      isLoading: false,
      error: null,
      addComment: mockAddComment,
      deleteComment: mockDeleteComment,
      mutate: mockMutate,
      commentCount: mockComments.length,
    });

    // Reset all mocks
    jest.clearAllMocks();

    console.log('🧪 Setting up Comments test environment...');
  });

  // TEST 1: Component renders with existing comments
  it('renders existing comments correctly', () => {
    console.log('🧪 Testing comments rendering...');

    render(<Comments postId={1} />);

    console.log('📝 Checking comment count display...');
    expect(screen.getByText('2 Comments')).toBeInTheDocument();

    console.log('📝 Checking individual comments...');
    expect(
      screen.getByText('Great article! Really helpful.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'I disagree with some points, but overall good content.',
      ),
    ).toBeInTheDocument();

    console.log('📝 Checking author names...');
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();

    console.log('📝 Checking comment form is present...');
    expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /post comment/i }),
    ).toBeInTheDocument();

    console.log('✅ Comments render correctly!');
  });

  // TEST 2: User can submit a new comment
  it('allows authenticated user to submit a new comment', async () => {
    console.log('🧪 Testing comment submission...');

    // Mock successful comment addition
    const newComment = {
      id: 3,
      content: 'This is a new comment',
      createdAt: new Date(),
      author: mockUser,
      postId: 1,
    };

    mockAddComment.mockResolvedValueOnce(newComment);

    render(<Comments postId={1} />);

    const commentInput = screen.getByPlaceholderText(/write a comment/i);
    const submitButton = screen.getByRole('button', { name: /post comment/i });

    console.log('📝 User typing a comment...');
    await user.type(commentInput, 'This is a new comment');

    console.log('📝 Checking input value...');
    expect(commentInput).toHaveValue('This is a new comment');

    console.log('📝 Checking submit button is enabled...');
    expect(submitButton).not.toBeDisabled();

    console.log('📝 Submitting the comment...');
    await user.click(submitButton);

    console.log('📝 Verifying addComment was called...');
    await waitFor(() => {
      expect(mockAddComment).toHaveBeenCalledWith('This is a new comment');
    });

    console.log('📝 Checking form is cleared after submission...');
    await waitFor(() => {
      expect(commentInput).toHaveValue('');
    });

    console.log('✅ Comment submission works correctly!');
  });

  // TEST 3: Form validation prevents empty comments
  it('prevents submission of empty comments', async () => {
    console.log('🧪 Testing form validation...');

    render(<Comments postId={1} />);

    const submitButton = screen.getByRole('button', { name: /post comment/i });

    console.log('📝 Checking submit button is disabled when empty...');
    expect(submitButton).toBeDisabled();

    console.log('📝 Attempting to submit empty comment...');
    await user.click(submitButton);

    console.log('📝 Verifying addComment was not called...');
    expect(mockAddComment).not.toHaveBeenCalled();

    console.log('✅ Form validation works correctly!');
  });

  // TEST 4: Character limit validation
  it('enforces character limit for comments', async () => {
    console.log('🧪 Testing character limit validation...');

    render(<Comments postId={1} />);

    const commentInput = screen.getByPlaceholderText(/write a comment/i);
    const longComment = 'x'.repeat(1001); // Assuming 1000 char limit

    console.log('📝 Typing a very long comment...');
    await user.type(commentInput, longComment);

    console.log('📝 Checking character counter appears...');
    expect(screen.getByText(/1001\/1000/)).toBeInTheDocument();

    console.log('📝 Checking submit button is disabled for long comments...');
    const submitButton = screen.getByRole('button', { name: /post comment/i });
    expect(submitButton).toBeDisabled();

    console.log('📝 Checking error message appears...');
    expect(screen.getByText(/comment is too long/i)).toBeInTheDocument();

    console.log('✅ Character limit validation works correctly!');
  });

  // TEST 5: Unauthenticated user sees login prompt
  it('shows login prompt for unauthenticated users', () => {
    console.log('🧪 Testing unauthenticated user experience...');

    // Mock unauthenticated state
    (useCurrentUser as jest.Mock).mockReturnValue({
      user: null,
      isLoggedIn: false,
      isLoading: false,
    });

    render(<Comments postId={1} />);

    console.log('📝 Checking comments are still visible...');
    expect(
      screen.getByText('Great article! Really helpful.'),
    ).toBeInTheDocument();

    console.log('📝 Checking comment form is not present...');
    expect(
      screen.queryByPlaceholderText(/write a comment/i),
    ).not.toBeInTheDocument();

    console.log('📝 Checking login prompt is shown...');
    expect(screen.getByText(/sign in to leave a comment/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();

    console.log('✅ Unauthenticated user experience works correctly!');
  });

  // TEST 6: Loading state handling
  it('shows loading state correctly', () => {
    console.log('🧪 Testing loading state...');

    // Mock loading state
    (useComments as jest.Mock).mockReturnValue({
      comments: [],
      isLoading: true,
      error: null,
      addComment: mockAddComment,
      deleteComment: mockDeleteComment,
      mutate: mockMutate,
      commentCount: 0,
    });

    render(<Comments postId={1} />);

    console.log('📝 Checking loading spinner is shown...');
    expect(screen.getByTestId('comments-loading')).toBeInTheDocument();

    console.log('📝 Checking comments are not shown during loading...');
    expect(screen.queryByText('Great article!')).not.toBeInTheDocument();

    console.log('✅ Loading state handled correctly!');
  });

  // TEST 7: Error state handling
  it('handles and displays errors gracefully', () => {
    console.log('🧪 Testing error state...');

    // Mock error state
    (useComments as jest.Mock).mockReturnValue({
      comments: [],
      isLoading: false,
      error: new Error('Failed to load comments'),
      addComment: mockAddComment,
      deleteComment: mockDeleteComment,
      mutate: mockMutate,
      commentCount: 0,
    });

    render(<Comments postId={1} />);

    console.log('📝 Checking error message is displayed...');
    expect(screen.getByText(/failed to load comments/i)).toBeInTheDocument();

    console.log('📝 Checking retry button is present...');
    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument();

    console.log('✅ Error state handled correctly!');
  });

  // TEST 8: Comment submission error handling
  it('handles comment submission errors', async () => {
    console.log('🧪 Testing comment submission error handling...');

    // Mock failed comment submission
    mockAddComment.mockRejectedValueOnce(new Error('Submission failed'));

    render(<Comments postId={1} />);

    const commentInput = screen.getByPlaceholderText(/write a comment/i);
    const submitButton = screen.getByRole('button', { name: /post comment/i });

    console.log('📝 User typing and submitting comment...');
    await user.type(commentInput, 'This comment will fail');
    await user.click(submitButton);

    console.log('📝 Waiting for error message...');
    await waitFor(() => {
      expect(screen.getByText(/failed to post comment/i)).toBeInTheDocument();
    });

    console.log('📝 Checking comment stays in input after error...');
    expect(commentInput).toHaveValue('This comment will fail');

    console.log('✅ Comment submission error handled correctly!');
  });

  // TEST 9: Optimistic comment updates
  it('shows optimistic updates when adding comments', async () => {
    console.log('🧪 Testing optimistic comment updates...');

    // Mock slow comment addition
    mockAddComment.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                id: 3,
                content: 'Optimistic comment',
                createdAt: new Date(),
                author: mockUser,
                postId: 1,
              }),
            1000,
          ),
        ),
    );

    render(<Comments postId={1} />);

    const commentInput = screen.getByPlaceholderText(/write a comment/i);
    const submitButton = screen.getByRole('button', { name: /post comment/i });

    console.log('📝 Submitting comment...');
    await user.type(commentInput, 'Optimistic comment');
    await user.click(submitButton);

    console.log('📝 Checking optimistic comment appears immediately...');
    expect(screen.getByText('Optimistic comment')).toBeInTheDocument();

    console.log('📝 Checking submit button shows loading state...');
    expect(
      screen.getByRole('button', { name: /posting.../i }),
    ).toBeInTheDocument();

    console.log('✅ Optimistic updates work correctly!');
  });

  // TEST 10: Delete comment functionality (for comment authors)
  it('allows comment authors to delete their own comments', async () => {
    console.log('🧪 Testing comment deletion...');

    // Mock comments with user as author of one comment
    const commentsWithUserComment = [
      ...mockComments,
      {
        id: 3,
        content: 'My own comment that I can delete',
        createdAt: new Date(),
        author: mockUser,
        postId: 1,
      },
    ];

    (useComments as jest.Mock).mockReturnValue({
      comments: commentsWithUserComment,
      isLoading: false,
      error: null,
      addComment: mockAddComment,
      deleteComment: mockDeleteComment,
      mutate: mockMutate,
      commentCount: commentsWithUserComment.length,
    });

    mockDeleteComment.mockResolvedValueOnce({});

    render(<Comments postId={1} />);

    console.log("📝 Finding user's own comment...");
    const userComment = screen.getByText('My own comment that I can delete');
    expect(userComment).toBeInTheDocument();

    console.log("📝 Finding delete button for user's comment...");
    const deleteButton = screen.getByTestId('delete-comment-3');
    expect(deleteButton).toBeInTheDocument();

    console.log('📝 Clicking delete button...');
    await user.click(deleteButton);

    console.log('📝 Confirming deletion in modal...');
    const confirmButton = screen.getByRole('button', { name: /delete/i });
    await user.click(confirmButton);

    console.log('📝 Verifying deleteComment was called...');
    await waitFor(() => {
      expect(mockDeleteComment).toHaveBeenCalledWith(3);
    });

    console.log('✅ Comment deletion works correctly!');
  });

  // TEST 11: Real-time comment updates
  it('updates comment list when new comments are added by others', async () => {
    console.log('🧪 Testing real-time comment updates...');

    const { rerender } = render(<Comments postId={1} />);

    console.log('📝 Initially showing 2 comments...');
    expect(screen.getByText('2 Comments')).toBeInTheDocument();

    // Simulate new comment from another user
    const updatedComments = [
      ...mockComments,
      {
        id: 4,
        content: 'New comment from another user',
        createdAt: new Date(),
        author: {
          name: 'Other User',
          email: 'other@example.com',
        },
        postId: 1,
      },
    ];

    console.log('📝 Simulating real-time update...');
    (useComments as jest.Mock).mockReturnValue({
      comments: updatedComments,
      isLoading: false,
      error: null,
      addComment: mockAddComment,
      deleteComment: mockDeleteComment,
      mutate: mockMutate,
      commentCount: updatedComments.length,
    });

    rerender(<Comments postId={1} />);

    console.log('📝 Checking updated comment count...');
    expect(screen.getByText('3 Comments')).toBeInTheDocument();

    console.log('📝 Checking new comment appears...');
    expect(
      screen.getByText('New comment from another user'),
    ).toBeInTheDocument();

    console.log('✅ Real-time updates work correctly!');
  });

  // TEST 12: Keyboard navigation and accessibility
  it('supports keyboard navigation and accessibility', async () => {
    console.log('🧪 Testing accessibility features...');

    render(<Comments postId={1} />);

    console.log('📝 Checking form has proper labels...');
    const commentInput = screen.getByLabelText(/comment/i);
    expect(commentInput).toBeInTheDocument();

    console.log('📝 Testing tab navigation...');
    await user.tab();
    expect(commentInput).toHaveFocus();

    await user.tab();
    const submitButton = screen.getByRole('button', { name: /post comment/i });
    expect(submitButton).toHaveFocus();

    console.log('📝 Testing Enter key submission...');
    await user.click(commentInput);
    await user.type(commentInput, 'Comment via keyboard');
    await user.keyboard('{Control>}{Enter}'); // Ctrl+Enter to submit

    console.log('📝 Verifying keyboard submission...');
    await waitFor(() => {
      expect(mockAddComment).toHaveBeenCalledWith('Comment via keyboard');
    });

    console.log('✅ Accessibility features work correctly!');
  });
});
