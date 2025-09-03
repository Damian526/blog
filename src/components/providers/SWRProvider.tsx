'use client';

import { SWRConfig } from 'swr';

export default function SWRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        onError: (error, key) => {
          console.error(`SWR Error for key "${key}":`, error);
        },

        // Global loading configuration
        loadingTimeout: 3000,

        // Global retry configuration
        shouldRetryOnError: (error) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return true;
        },

        // Global revalidation settings
        revalidateOnFocus: false,
        revalidateOnReconnect: true,

        // Global deduplication interval (5 minutes)
        dedupingInterval: 300000,

        // Focus throttle interval
        focusThrottleInterval: 5000,

        // Global refresh interval (disabled by default)
        refreshInterval: 0,

        // Retry configuration
        errorRetryInterval: 5000,
        errorRetryCount: 3,

        // Keep previous data while revalidating
        keepPreviousData: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
