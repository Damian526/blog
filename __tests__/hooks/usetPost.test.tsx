/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { usePost } from '@/hooks/usePost';

// Mock the API
jest.mock('@/server/api', () => ({
  api: {
    posts: {
      getById: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import { api } from '@/server/api';

// Mock global fetch
global.fetch = jest.fn();

// ✅ Helper to wrap hook with SWR provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig
    value={{
      dedupingInterval: 0,
      provider: () => new Map(),
      errorRetryCount: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }}
  >
    {children}
  </SWRConfig>
);

describe('usePost Hook - Advanced Tests', () => {
  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'This is test content',
    excerpt: 'This is test content excerpt',
    createdAt: '2024-01-15T00:00:00.000Z', // ISO string format
    updatedAt: '2024-01-15T00:00:00.000Z',
    published: true,
    publishedAt: '2024-01-15T00:00:00.000Z',
    coverImageUrl: 'https://example.com/image.jpg',
    authorId: 1, // Required field
    declineReason: null, // Required field (nullable)
    author: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      image: 'https://example.com/avatar.jpg',
      createdAt: '2024-01-15T00:00:00.000Z', // Required field
    },
    subcategories: [
      {
        id: 1,
        name: 'React',
        categoryId: 1, // Required field
        category: { id: 1, name: 'Frontend' },
      },
    ],
    _count: { comments: 5 },
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    console.log('🧪 Setting up fresh test environment...');
  });

  // TEST 1: Hook returns correct initial state
  it('returns correct initial state when no postId provided', () => {
    console.log('🧪 Testing initial state with no postId...');

    const { result } = renderHook(() => usePost(null), { wrapper });

    console.log('📝 Checking initial values...');
    expect(result.current.post).toBe(null);
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPublished).toBe(false);

    console.log('📝 Checking functions exist...');
    expect(typeof result.current.updatePost).toBe('function');
    expect(typeof result.current.togglePublished).toBe('function');
    expect(typeof result.current.mutate).toBe('function');

    console.log('✅ Initial state is correct!');
  });

  // TEST 2: Hook fetches post data successfully
  it('fetches and returns post data successfully', async () => {
    console.log('🧪 Testing successful post fetching...');

    // ✅ Mock successful API response
    (api.posts.getById as jest.Mock).mockResolvedValueOnce(mockPost);

    const { result } = renderHook(() => usePost(1), { wrapper });

    console.log('📝 Initially loading should be true...');
    // ✅ Wait a bit for SWR to start loading
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(true);
      },
      { timeout: 100 },
    );

    console.log('📝 Waiting for data to load...');
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.post).toEqual(mockPost);
      },
      { timeout: 5000 },
    );

    console.log('📝 Checking fetched data...');
    expect(result.current.post).toEqual(mockPost);
    expect(result.current.isPublished).toBe(true);
    expect(result.current.error).toBeUndefined();

    console.log('📝 Verifying API was called correctly...');
    expect(api.posts.getById).toHaveBeenCalledWith(1);

    console.log('✅ Post fetching works correctly!');
  });

  // TEST 3: Hook handles fetch errors
  it('handles fetch errors correctly', async () => {
    console.log('🧪 Testing error handling...');

    // ✅ Mock API error - reject the promise
    (api.posts.getById as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => usePost(1), { wrapper });

    console.log('📝 Waiting for error state...');
    await waitFor(
      () => {
        expect(result.current.error).toBeDefined();
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 5000 },
    );

    console.log('📝 Checking error state...');
    expect(result.current.post).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeDefined();

    console.log('✅ Error handling works correctly!');
  });

  // TEST 4: updatePost function works correctly
  it('updates post data optimistically and persists to server', async () => {
    console.log('🧪 Testing post update functionality...');

    // ✅ Mock initial fetch
    (api.posts.getById as jest.Mock).mockResolvedValueOnce(mockPost);

    const { result } = renderHook(() => usePost(1), { wrapper });

    // Wait for initial data
    await waitFor(() => {
      expect(result.current.post).toEqual(mockPost);
    });

    console.log('📝 Preparing update...');
    const updateData = { title: 'Updated Title' };

    // ✅ Mock update API call
    (api.posts.update as jest.Mock).mockResolvedValueOnce({ ...mockPost, ...updateData });

    console.log('📝 Calling updatePost...');
    await act(async () => {
      await result.current.updatePost(updateData);
    });

    console.log('📝 Verifying update API call...');
    expect(api.posts.update).toHaveBeenCalledWith(1, updateData);

    console.log('✅ Post update works correctly!');
  });

  // TEST 5: updatePost handles errors by reverting changes
  it('reverts optimistic updates when server update fails', async () => {
    console.log('🧪 Testing optimistic update reversion on error...');

    // ✅ Mock initial successful fetch
    (api.posts.getById as jest.Mock).mockResolvedValueOnce(mockPost);

    const { result } = renderHook(() => usePost(1), { wrapper });

    // Wait for initial data to load
    await waitFor(() => {
      expect(result.current.post).toEqual(mockPost);
    });

    console.log('📝 Original title:', result.current.post?.title);

    // ✅ Mock update to fail
    (api.posts.update as jest.Mock).mockRejectedValueOnce(
      new Error('Server error'),
    );

    // ✅ Store the original title before update
    const originalTitle = result.current.post?.title;

    // ✅ Attempt update that will fail
    try {
      await act(async () => {
        await result.current.updatePost({ title: 'Failed Update' });
      });
    } catch (error) {
      console.log('✅ Update failed as expected:', error instanceof Error ? error.message : String(error));
    }

    // ✅ Verify data reverted to original
    await waitFor(() => {
      expect(result.current.post?.title).toBe(originalTitle);
    });

    console.log('✅ Optimistic update reversion works correctly!');
  });

  // TEST 6: togglePublished function works
  it('toggles published status correctly', async () => {
    console.log('🧪 Testing publish toggle functionality...');

    // Mock initial fetch with unpublished post
    const unpublishedPost = { ...mockPost, published: false };
    (api.posts.getById as jest.Mock).mockResolvedValueOnce(unpublishedPost);

    const { result } = renderHook(() => usePost(1), { wrapper });

    // Wait for initial data
    await waitFor(() => {
      expect(result.current.post).toEqual(unpublishedPost);
    });

    console.log('📝 Checking initial published status...');
    expect(result.current.isPublished).toBe(false);

    // ✅ Mock successful toggle
    const publishedPost = { ...unpublishedPost, published: true };
    (api.posts.update as jest.Mock).mockResolvedValueOnce(publishedPost);

    console.log('📝 Calling togglePublished...');
    await act(async () => {
      await result.current.togglePublished();
    });

    // ✅ Verify the published status changed
    await waitFor(() => {
      expect(result.current.post?.published).toBe(true);
      expect(result.current.isPublished).toBe(true);
    });

    console.log('✅ Publish toggle works correctly!');
  });

  // TEST 7: Hook doesn't fetch when postId is null
  it('does not make API call when postId is null', async () => {
    console.log('🧪 Testing no fetch when postId is null...');

    renderHook(() => usePost(null), { wrapper });

    // ✅ Wait a bit to ensure no calls are made
    await waitFor(() => {
      expect(api.posts.getById).not.toHaveBeenCalled();
    });

    console.log('✅ Correctly avoids unnecessary API calls!');
  });

  // TEST 8: Hook switches between different postIds
  it('fetches new data when postId changes', async () => {
    console.log('🧪 Testing postId changes...');

    const post1 = { ...mockPost, id: 1, title: 'Post 1' };
    const post2 = { ...mockPost, id: 2, title: 'Post 2' };

    // ✅ Mock first post fetch
    (api.posts.getById as jest.Mock).mockResolvedValueOnce(post1);

    const { result, rerender } = renderHook(({ postId }) => usePost(postId), {
      wrapper,
      initialProps: { postId: 1 as number | null },
    });

    // Wait for first post
    await waitFor(() => {
      expect(result.current.post).toEqual(post1);
    });

    console.log('📝 Changing to different postId...');

    // ✅ Mock second post fetch
    (api.posts.getById as jest.Mock).mockResolvedValueOnce(post2);

    // Change postId
    rerender({ postId: 2 });

    // Wait for second post
    await waitFor(() => {
      expect(result.current.post).toEqual(post2);
    });

    console.log('📝 Verifying both API calls were made...');
    expect(api.posts.getById).toHaveBeenCalledWith(1);
    expect(api.posts.getById).toHaveBeenCalledWith(2);

    console.log('✅ PostId changes work correctly!');
  });
});
