import { renderHook, waitFor } from '@testing-library/react';
import { usePost } from '@/hooks/usePost';

// Mock SWR
jest.mock('swr', () => {
  return jest.fn((key, fetcher, options) => {
    const mockData = {
      id: 1,
      title: 'Test Post',
      content: 'This is a test post content',
      published: true,
      declineReason: null,
      createdAt: '2024-01-15T00:00:00.000Z',
      author: {
        id: 1,
        name: 'Test Author',
        email: 'test@example.com',
        image: null,
        createdAt: '2024-01-15T00:00:00.000Z',
      },
      subcategories: [],
      _count: {
        comments: 5,
      },
    };

    // Return different data based on the key
    if (!key) {
      return {
        data: null,
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      };
    }

    if (key[1] === 999) {
      // Simulate error for post ID 999
      return {
        data: null,
        error: new Error('Post not found'),
        isLoading: false,
        mutate: jest.fn(),
      };
    }

    if (key[1] === 2) {
      // Different post for ID 2
      return {
        data: {
          ...mockData,
          id: 2,
          title: 'Second Test Post',
        },
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      };
    }

    // Default post for ID 1
    return {
      data: mockData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    };
  });
});

// Mock the API
jest.mock('@/server/api', () => ({
  api: {
    posts: {
      getById: jest.fn().mockImplementation((id) => {
        if (id === 999) {
          throw new Error('Post not found');
        }
        return Promise.resolve({
          id,
          title: id === 2 ? 'Second Test Post' : 'Test Post',
          content: 'This is a test post content',
          published: true,
          declineReason: null,
          createdAt: '2024-01-15T00:00:00.000Z',
          author: {
            id: 1,
            name: 'Test Author',
            email: 'test@example.com',
            image: null,
            createdAt: '2024-01-15T00:00:00.000Z',
          },
          subcategories: [],
          _count: {
            comments: 5,
          },
        });
      }),
    },
  },
}));

describe('usePost Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when no postId is provided', () => {
    const { result } = renderHook(() => usePost(null));

    expect(result.current.post).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.refetch).toBe('function');
  });

  it('fetches post data when postId is provided', async () => {
    const { result } = renderHook(() => usePost(1));

    expect(result.current.post).toBeDefined();
    expect(result.current.post?.id).toBe(1);
    expect(result.current.post?.title).toBe('Test Post');
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('handles different post IDs correctly', async () => {
    const { result: result1 } = renderHook(() => usePost(1));
    const { result: result2 } = renderHook(() => usePost(2));

    expect(result1.current.post?.title).toBe('Test Post');
    expect(result2.current.post?.title).toBe('Second Test Post');
  });

  it('handles errors correctly', async () => {
    const { result } = renderHook(() => usePost(999));

    expect(result.current.post).toBeNull();
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toBe('Post not found');
    expect(result.current.isLoading).toBe(false);
  });

  it('provides refetch functionality', () => {
    const { result } = renderHook(() => usePost(1));

    expect(typeof result.current.refetch).toBe('function');
    
    // Should be able to call refetch without errors
    expect(() => {
      result.current.refetch();
    }).not.toThrow();
  });

  it('returns expected post structure', () => {
    const { result } = renderHook(() => usePost(1));

    expect(result.current.post).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        content: expect.any(String),
        published: expect.any(Boolean),
        createdAt: expect.any(String),
        author: expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
        }),
        subcategories: expect.any(Array),
        _count: expect.objectContaining({
          comments: expect.any(Number),
        }),
      })
    );
  });
});

describe('usePost Hook - Server Actions Note', () => {
  it('should note that mutations have moved to server actions', () => {
    // NOTE: Post mutations (create, update, delete) have been moved to server actions:
    // - createPost from /lib/actions/posts.ts
    // - updatePost from /lib/actions/posts.ts  
    // - deletePost from /lib/actions/posts.ts
    // 
    // The usePost hook now only handles fetching data via SWR.
    // Components should import and use server actions directly for mutations.
    
    const { result } = renderHook(() => usePost(1));
    
    // Verify the hook only provides fetching functionality
    expect(result.current).toEqual(
      expect.objectContaining({
        post: expect.any(Object),
        error: null,
        isLoading: expect.any(Boolean),
        refetch: expect.any(Function),
      })
    );
    
    // Verify mutation functions are NOT present (moved to server actions)
    expect(result.current).not.toHaveProperty('updatePost');
    expect(result.current).not.toHaveProperty('deletePost');
    expect(result.current).not.toHaveProperty('togglePublished');
  });
});
