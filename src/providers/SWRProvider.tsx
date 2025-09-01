import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

// ============================================
// GLOBAL SWR CONFIGURATION
// ============================================

interface SWRProviderProps {
  children: ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // Global error handler
        onError: (error, key) => {
          console.error(`SWR Error for key "${key}":`, error);
          
          // You can add global error reporting here
          // e.g., send to error tracking service like Sentry
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
        
        // Global cache configuration
        provider: () => new Map(), // Use default cache
        
        // Enable React 18 features
        suspense: false, // You can enable this if you want to use Suspense
        
        // Compare function for data
        compare: (a, b) => {
          // Custom comparison logic if needed
          return a === b;
        },
        
        // Keep previous data while revalidating
        keepPreviousData: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
