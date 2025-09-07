import { renderHook } from '@testing-library/react';
import useSWR from 'swr';
import '@testing-library/jest-dom';
import { useCategories } from '@/hooks/useCategories';

// Mock the API
jest.mock('@/server/api', () => ({
  api: {
    categories: {
      getAll: jest.fn(),
    },
  },
}));

// Mock SWR
jest.mock('swr');

const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;

// Helper function to create complete SWR response
const createMockSWRResponse = (data: any, error: any = null, isLoading = false) => ({
  data,
  error,
  isLoading,
  isValidating: false,
  mutate: jest.fn(),
} as any);

describe('useCategories Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCategories = [
    {
      id: 1,
      name: 'Technology',
      subcategories: [
        { id: 1, name: 'React' },
        { id: 2, name: 'Vue.js' },
        { id: 3, name: 'Angular' },
      ],
    },
    {
      id: 2,
      name: 'Design',
      subcategories: [
        { id: 4, name: 'UI/UX' },
        { id: 5, name: 'Graphic Design' },
      ],
    },
  ];

  it('returns categories data when loaded successfully', () => {
    mockUseSWR.mockReturnValue(createMockSWRResponse(mockCategories));

    const { result } = renderHook(() => useCategories());

    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('returns empty array when no data is available', () => {
    mockUseSWR.mockReturnValue(createMockSWRResponse(undefined));

    const { result } = renderHook(() => useCategories());

    expect(result.current.categories).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('returns loading state correctly', () => {
    mockUseSWR.mockReturnValue(createMockSWRResponse(undefined, null, true));

    const { result } = renderHook(() => useCategories());

    expect(result.current.categories).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('returns error state correctly', () => {
    const mockError = new Error('Failed to fetch categories');
    mockUseSWR.mockReturnValue(createMockSWRResponse(undefined, mockError));

    const { result } = renderHook(() => useCategories());

    expect(result.current.categories).toEqual([]);
    expect(result.current.error).toBe(mockError);
    expect(result.current.isLoading).toBe(false);
  });

  it('provides refetch functionality for cache revalidation', () => {
    const mockMutate = jest.fn();
    const mockResponse = createMockSWRResponse(mockCategories);
    mockResponse.mutate = mockMutate;
    mockUseSWR.mockReturnValue(mockResponse);

    const { result } = renderHook(() => useCategories());

    result.current.refetch();

    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  it('calls SWR with correct configuration', () => {
    mockUseSWR.mockReturnValue(createMockSWRResponse(mockCategories));

    renderHook(() => useCategories());

    expect(mockUseSWR).toHaveBeenCalledWith('categories', expect.any(Function), {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 3600000,
    });
  });

  it('handles categories with empty subcategories', () => {
    const categoriesWithEmptySubcategories = [
      {
        id: 1,
        name: 'Technology',
        subcategories: [],
      },
    ];

    mockUseSWR.mockReturnValue(createMockSWRResponse(categoriesWithEmptySubcategories));

    const { result } = renderHook(() => useCategories());

    expect(result.current.categories).toEqual(categoriesWithEmptySubcategories);
    expect(result.current.categories[0].subcategories).toEqual([]);
  });

  it('handles single category correctly', () => {
    const singleCategory = [
      {
        id: 1,
        name: 'Technology',
        subcategories: [
          { id: 1, name: 'React' },
        ],
      },
    ];

    mockUseSWR.mockReturnValue(createMockSWRResponse(singleCategory));

    const { result } = renderHook(() => useCategories());

    expect(result.current.categories).toHaveLength(1);
    expect(result.current.categories[0]).toEqual(singleCategory[0]);
  });

  it('handles complex category structure', () => {
    const complexCategories = [
      {
        id: 1,
        name: 'Technology',
        subcategories: [
          { id: 1, name: 'Frontend' },
          { id: 2, name: 'Backend' },
          { id: 3, name: 'DevOps' },
          { id: 4, name: 'Mobile' },
        ],
      },
      {
        id: 2,
        name: 'Business',
        subcategories: [
          { id: 5, name: 'Marketing' },
          { id: 6, name: 'Sales' },
          { id: 7, name: 'Finance' },
        ],
      },
      {
        id: 3,
        name: 'Creative',
        subcategories: [
          { id: 8, name: 'Writing' },
          { id: 9, name: 'Photography' },
        ],
      },
    ];

    mockUseSWR.mockReturnValue({
      data: complexCategories,
      error: null,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useCategories());

    expect(result.current.categories).toHaveLength(3);
    expect(result.current.categories[0].subcategories).toHaveLength(4);
    expect(result.current.categories[1].subcategories).toHaveLength(3);
    expect(result.current.categories[2].subcategories).toHaveLength(2);
  });
});
