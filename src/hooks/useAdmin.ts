// Admin hooks - these should be replaced with SSR queries in admin pages
// For now, returning placeholder data to prevent errors

export function useAdminUsers() {
  return {
    users: [],
    error: new Error('Admin users should be fetched via SSR queries'),
    isLoading: false,
    refetch: () => {},
  };
}

export function useAdminPosts() {
  return {
    posts: [],
    error: new Error('Admin posts should be fetched via SSR queries'),
    isLoading: false,
    refetch: () => {},
  };
}

export function useAdminStats() {
  return {
    stats: null,
    error: new Error('Admin stats should be fetched via SSR queries'),
    isLoading: false,
    refetch: () => {},
  };
}
