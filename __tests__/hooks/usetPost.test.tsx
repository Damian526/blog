/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
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
    console.log('📝 Waiting for initial data...');
    await waitFor(
      () => {
        expect(result.current.post).toEqual(mockPost);
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 5000 },
    );

    console.log('📝 Preparing update...');
    const updateData = { title: 'Updated Title' };

    // ✅ Mock update API call
    (api.posts.update as jest.Mock).mockResolvedValueOnce({ ...mockPost, ...updateData });

    console.log('📝 Calling updatePost...');
    await result.current.updatePost(updateData);

    console.log('📝 Verifying update API call...');
    expect(api.posts.update).toHaveBeenCalledWith(1, updateData);

    console.log('✅ Post update works correctly!');
  });

  // TEST 5: updatePost handles errors by reverting changes
  // TEST 5: updatePost handles errors by reverting changes
  it('reverts optimistic updates when server update fails', async () => {
    console.log('🧪 Testing optimistic update reversion on error...');

    // ✅ Mock initial fetch
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPost,
    });

    const { result } = renderHook(() => usePost(1), { wrapper });

    // Wait for initial data
    console.log('📝 Waiting for initial data...');
    await waitFor(
      () => {
        expect(result.current.post).toEqual(mockPost);
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 5000 },
    );

    console.log('📝 Original title:', result.current.post?.title);

    console.log('📝 Preparing failed update...');
    const updateData = { title: 'Failed Update' };

    // ✅ Mock failed update - IMPORTANT: return rejected response
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Update failed'));

    console.log('📝 Attempting update that will fail...');

    // ✅ Store the original title before update
    const originalTitle = result.current.post?.title;

    try {
      await result.current.updatePost(updateData);

      // This should not happen if error is thrown
      console.log("❌ Update should have failed but didn't");
    } catch (error) {
      console.log('✅ Update failed as expected:', error instanceof Error ? error.message : String(error));
    }

    console.log('📝 Checking that original data is restored...');

    // ✅ Give it time to revert and check multiple times
    await waitFor(
      () => {
        console.log(
          '📝 Current title after revert:',
          result.current.post?.title,
        );
        expect(result.current.post?.title).toBe(originalTitle);
      },
      {
        timeout: 3000,
        interval: 100, // Check every 100ms
      },
    );

    console.log('✅ Optimistic update reversion works correctly!');
  });

  // TEST 6: togglePublished function works
  it('toggles published status correctly', async () => {
    console.log('🧪 Testing publish toggle functionality...');

    // Mock initial fetch with unpublished post
    const unpublishedPost = { ...mockPost, published: false };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => unpublishedPost,
    });

    const { result } = renderHook(() => usePost(1), { wrapper });

    // Wait for initial data
    console.log('📝 Waiting for initial data...');
    await waitFor(
      () => {
        expect(result.current.post).toEqual(unpublishedPost);
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 5000 },
    );

    console.log('📝 Checking initial published status...');
    expect(result.current.isPublished).toBe(false);

    console.log('📝 Mocking successful toggle...');
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...unpublishedPost, published: true }),
    });

    console.log('📝 Calling togglePublished...');
    await result.current.togglePublished();

    console.log('📝 Verifying toggle API call...');
    expect(fetch).toHaveBeenCalledWith('/api/posts/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: true }),
    });

    console.log('✅ Publish toggle works correctly!');
  });

  // TEST 7: Hook doesn't fetch when postId is null
  it('does not make API call when postId is null', async () => {
    console.log('🧪 Testing no fetch when postId is null...');

    renderHook(() => usePost(null), { wrapper });

    // ✅ Wait a bit to ensure no calls are made
    await waitFor(
      () => {
        expect(fetch).not.toHaveBeenCalled();
      },
      { timeout: 1000 },
    );

    console.log('📝 Verifying no API calls were made...');
    expect(fetch).not.toHaveBeenCalled();

    console.log('✅ Correctly avoids unnecessary API calls!');
  });

  // TEST 8: Hook switches between different postIds
  it('fetches new data when postId changes', async () => {
    console.log('🧪 Testing postId changes...');

    const post1 = { ...mockPost, id: 1, title: 'Post 1' };
    const post2 = { ...mockPost, id: 2, title: 'Post 2' };

    // ✅ Mock first post fetch
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => post1,
    });

    const { result, rerender } = renderHook(({ postId }) => usePost(postId), {
      wrapper,
      initialProps: { postId: 1 as number | null },
    });

    // Wait for first post
    console.log('📝 Waiting for first post...');
    await waitFor(
      () => {
        expect(result.current.post).toEqual(post1);
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 5000 },
    );

    console.log('📝 Changing to different postId...');

    // ✅ Mock second post fetch
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => post2,
    });

    // Change postId
    rerender({ postId: 2 });

    // Wait for second post
    console.log('📝 Waiting for second post...');
    await waitFor(
      () => {
        expect(result.current.post).toEqual(post2);
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 5000 },
    );

    console.log('📝 Verifying both API calls were made...');
    expect(fetch).toHaveBeenCalledWith('/api/posts/1');
    expect(fetch).toHaveBeenCalledWith('/api/posts/2');

    console.log('✅ PostId changes work correctly!');
  });
});
