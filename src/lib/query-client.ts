/**
 * query-client.ts
 * TanStack Query client configuration
 */
import { QueryClient } from '@tanstack/react-query';
import { getApiErrorMessage } from './api-client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,       // 2 minutes
      gcTime: 1000 * 60 * 10,          // 10 minutes garbage collection
      retry: (failureCount, error) => {
        // Don't retry on 401/403/404
        const msg = getApiErrorMessage(error);
        if (msg.includes('401') || msg.includes('403') || msg.includes('404')) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
