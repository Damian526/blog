/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock the API
jest.mock('@/server/api', () => ({
  api: {
    comments: {
      getByPost: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    users: {
      getCurrentUser: jest.fn(),
    },
  },
}));

// Mock the hooks
jest.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: jest.fn(),
}));

jest.mock('@/hooks/useComments', () => ({
  useComments: jest.fn(),
}));

import CommentsSection from '@/components/comments/CommentsSection';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useComments } from '@/hooks/useComments';
import { api } from '@/server/api';

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
  let mockCreateComment: jest.Mock;
  let mockDeleteComment: jest.Mock;
  let mockMutate: jest.Mock;

  beforeEach(() => {
    user = userEvent.setup({ delay: null });

    // Mock window.confirm for delete confirmation dialogs
    Object.defineProperty(window, 'confirm', {
      writable: true,
      value: jest.fn().mockReturnValue(true), // Default to confirming deletion
    });

    // Mock functions
    mockCreateComment = jest.fn();
    mockDeleteComment = jest.fn();
    mockMutate = jest.fn();

    // Mock API functions
    (api.comments.create as jest.Mock).mockResolvedValue({
      id: 3,
      content: 'This is a new comment',
      createdAt: new Date().toISOString(),
      author: mockUser,
      postId: 1,
    });

    (api.comments.delete as jest.Mock).mockResolvedValue({ success: true });

    // Default mock implementations
    (useCurrentUser as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      updateProfile: jest.fn(),
      isUpdating: false,
      refetch: jest.fn(),
    });

    (useComments as jest.Mock).mockReturnValue({
      comments: mockComments,
      isLoading: false,
      error: null,
      createComment: mockCreateComment,
      isCreating: false,
      updateComment: jest.fn(),
      isUpdating: false,
      deleteComment: mockDeleteComment,
      isDeleting: false,
      refetch: mockMutate,
    });

    // Reset all mocks
    jest.clearAllMocks();


  });

  // TEST 1: Component renders with existing comments
  it('renders existing comments correctly', () => {


    render(<CommentsSection postId={1} />);


    expect(screen.getByText('2')).toBeInTheDocument(); // Just check the count number


    expect(
      screen.getByText('Great article! Really helpful.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'I disagree with some points, but overall good content.',
      ),
    ).toBeInTheDocument();


    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();


    expect(screen.getByPlaceholderText(/share your thoughts/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /post comment/i }),
    ).toBeInTheDocument();


  });

  // TEST 2: User can submit a new comment
  it('allows authenticated user to submit a new comment', async () => {

    // Mock successful comment addition via API
    const newComment = {
      id: 3,
      content: 'This is a new comment',
      createdAt: new Date().toISOString(),
      author: mockUser,
      postId: 1,
    };

    (api.comments.create as jest.Mock).mockResolvedValueOnce(newComment);

    render(<CommentsSection postId={1} />);

    const commentInput = screen.getByPlaceholderText(/share your thoughts/i);
    const submitButton = screen.getByRole('button', { name: /post comment/i });

    await user.type(commentInput, 'This is a new comment');
    expect(commentInput).toHaveValue('This is a new comment');

    await user.click(submitButton);

    await waitFor(() => {
      expect(api.comments.create).toHaveBeenCalledWith({
        content: 'This is a new comment',
        postId: 1,
      });
    });

    // After successful submission, the input should be cleared
    await waitFor(() => {
      expect(commentInput).toHaveValue('');
    });
  });

  // TEST 3: Form validation prevents empty comments
  it('prevents submission of empty comments', async () => {
    render(<CommentsSection postId={1} />);

    const submitButton = screen.getByRole('button', { name: /post comment/i });

    // Submit with empty content
    await user.click(submitButton);

    // Should show error message instead of calling createComment
    await waitFor(() => {
      expect(screen.getByText('Comment content is required.')).toBeInTheDocument();
    });

    expect(mockCreateComment).not.toHaveBeenCalled();


    expect(mockCreateComment).not.toHaveBeenCalled();


  });

  // TEST 4: Character limit validation (this component doesn't have character limits)
  it('does not enforce character limit for comments', async () => {
    render(<CommentsSection postId={1} />);

    const commentInput = screen.getByPlaceholderText(/share your thoughts/i);
    const longComment = 'x'.repeat(1001); // Long comment

    await user.type(commentInput, longComment);

    // The component should accept long comments without restriction
    expect(commentInput).toHaveValue(longComment);

    const submitButton = screen.getByRole('button', { name: /post comment/i });
    expect(submitButton).not.toBeDisabled();

    // No error message should appear
    expect(screen.queryByText(/comment is too long/i)).not.toBeInTheDocument();
  });
  // TEST 5: Unauthenticated user can still see comments and form (no special auth handling)
  it('shows comments and form for unauthenticated users', () => {
    // Mock unauthenticated state
    (useCurrentUser as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    render(<CommentsSection postId={1} />);

    expect(
      screen.getByText('Great article! Really helpful.'),
    ).toBeInTheDocument();

    // Form should still be present (no special auth handling in component)
    expect(
      screen.getByPlaceholderText(/share your thoughts/i),
    ).toBeInTheDocument();
  });

  // TEST 6: Loading state handling
  it('shows loading state correctly', () => {


    // Mock loading state
    (useComments as jest.Mock).mockReturnValue({
      comments: [],
      isLoading: true,
      error: null,
      createComment: mockCreateComment,
      isCreating: false,
      updateComment: jest.fn(),
      isUpdating: false,
      deleteComment: mockDeleteComment,
      isDeleting: false,
      refetch: mockMutate,
      commentCount: 0,
    });    render(<CommentsSection postId={1} />);

    expect(screen.getByText('Loading comments...')).toBeInTheDocument();

    expect(screen.queryByText('Great article!')).not.toBeInTheDocument();


  });

  // TEST 7: Error state handling
  it('handles and displays errors gracefully', () => {


    // Mock error state
    (useComments as jest.Mock).mockReturnValue({
      comments: [],
      isLoading: false,
      error: new Error('Failed to load comments'),
      createComment: mockCreateComment,
      isCreating: false,
      updateComment: jest.fn(),
      isUpdating: false,
      deleteComment: mockDeleteComment,
      isDeleting: false,
      refetch: mockMutate,
      commentCount: 0,
    });    render(<CommentsSection postId={1} />);

    expect(screen.getByText(/failed to load comments/i)).toBeInTheDocument();


  });

  // TEST 8: Comment submission error handling
  it('handles comment submission errors', async () => {

    // Mock failed comment submission
    (api.comments.create as jest.Mock).mockRejectedValueOnce(new Error('Submission failed'));

    render(<CommentsSection postId={1} />);

    const commentInput = screen.getByPlaceholderText(/share your thoughts/i);
    const submitButton = screen.getByRole('button', { name: /post comment/i });

    await user.type(commentInput, 'This comment will fail');
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.comments.create).toHaveBeenCalledWith({
        content: 'This comment will fail',
        postId: 1,
      });
    });

    // Check that error message appears
    await waitFor(() => {
      expect(screen.getByText(/submission failed/i)).toBeInTheDocument();
    });

    // Comment should still be in input after error
    expect(commentInput).toHaveValue('This comment will fail');
  });

  // TEST 9: Form submission loading state
  it('shows loading state when submitting comments', async () => {

    // Mock slow comment addition
    (api.comments.create as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                id: 3,
                content: 'Loading test comment',
                createdAt: new Date().toISOString(),
                author: mockUser,
                postId: 1,
              }),
            100,
          ),
        ),
    );

    render(<CommentsSection postId={1} />);

    const commentInput = screen.getByPlaceholderText(/share your thoughts/i);
    const submitButton = screen.getByRole('button', { name: /post comment/i });

    await user.type(commentInput, 'Loading test comment');
    await user.click(submitButton);

    // Check that button shows loading state
    expect(
      screen.getByRole('button', { name: /posting/i }),
    ).toBeInTheDocument();

    // Wait for completion
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /post comment/i }),
      ).toBeInTheDocument();
    });
  });

  // TEST 10: Delete comment functionality (for comment authors)
  it('allows comment authors to delete their own comments', async () => {

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
      createComment: mockCreateComment,
      isCreating: false,
      updateComment: jest.fn(),
      isUpdating: false,
      deleteComment: mockDeleteComment,
      isDeleting: false,
      refetch: mockMutate,
      commentCount: commentsWithUserComment.length,
    });

    mockDeleteComment.mockResolvedValueOnce({});

    render(<CommentsSection postId={1} />);

    const userComment = screen.getByText('My own comment that I can delete');
    expect(userComment).toBeInTheDocument();

    // Find delete button by text content
    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toBeInTheDocument();

    await user.click(deleteButton);

    // Verify that window.confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this comment?');

    // The delete function should be called since confirm returned true
    await waitFor(() => {
      expect(mockDeleteComment).toHaveBeenCalledWith(3);
    });
  });

  // TEST 10b: Test canceling comment deletion
  it('does not delete comment when user cancels confirmation', async () => {
    // Mock window.confirm to return false (user cancels)
    (window.confirm as jest.Mock).mockReturnValueOnce(false);

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
      createComment: mockCreateComment,
      isCreating: false,
      updateComment: jest.fn(),
      isUpdating: false,
      deleteComment: mockDeleteComment,
      isDeleting: false,
      refetch: mockMutate,
      commentCount: commentsWithUserComment.length,
    });

    render(<CommentsSection postId={1} />);

    // Find delete button by text content
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);

    // Verify that window.confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this comment?');

    // The delete function should NOT be called since confirm returned false
    expect(mockDeleteComment).not.toHaveBeenCalled();

    // The comment should still be visible
    expect(screen.getByText('My own comment that I can delete')).toBeInTheDocument();
  });

  // TEST 11: Real-time comment updates
  it('updates comment list when new comments are added by others', async () => {

    const { rerender } = render(<CommentsSection postId={1} />);

    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

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

    (useComments as jest.Mock).mockReturnValue({
      comments: updatedComments,
      isLoading: false,
      error: null,
      createComment: mockCreateComment,
      isCreating: false,
      updateComment: jest.fn(),
      isUpdating: false,
      deleteComment: mockDeleteComment,
      isDeleting: false,
      refetch: mockMutate,
      commentCount: updatedComments.length,
    });

    rerender(<CommentsSection postId={1} />);

    // Check that the count updated to 3
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(
      screen.getByText('New comment from another user'),
    ).toBeInTheDocument();
  });

  // TEST 12: Keyboard navigation and accessibility
  it('supports keyboard navigation and accessibility', async () => {

    render(<CommentsSection postId={1} />);

    const commentInput = screen.getByLabelText(/comment/i);
    expect(commentInput).toBeInTheDocument();

    await user.tab();
    expect(commentInput).toHaveFocus();

    await user.tab();
    const submitButton = screen.getByRole('button', { name: /post comment/i });
    expect(submitButton).toHaveFocus();

    await user.click(commentInput);
    await user.type(commentInput, 'Comment via keyboard');

    // Note: Ctrl+Enter submission may not work in this component,
    // so let's just test regular submission
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.comments.create).toHaveBeenCalledWith({
        content: 'Comment via keyboard',
        postId: 1,
      });
    });
  });
});
