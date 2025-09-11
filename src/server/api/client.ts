import { z } from 'zod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiClientOptions {
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
  headers?: Record<string, string>;
}

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  retryCondition?: (error: ApiError) => boolean;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit & ApiClientOptions = {},
    schema?: z.ZodSchema<T>,
    retryOptions: RetryOptions = {}
  ): Promise<T> {
    const {
      cache = 'no-store', // ✅ NO server-side caching - let SWR handle it!
      revalidate,
      tags = [],
      headers = {},
      ...fetchOptions
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      cache,
      next: {
        revalidate,
        tags,
      },
    };

    const {
      maxRetries = 3,
      retryDelay = 1000,
      retryCondition = (error) => error.status >= 500,
    } = retryOptions;

    let lastError: ApiError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, config);

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          const error = new ApiError(
            errorText || `HTTP ${response.status}`,
            response.status
          );

          // If it's the last attempt or error shouldn't be retried, throw immediately
          if (attempt === maxRetries || !retryCondition(error)) {
            throw error;
          }

          lastError = error;
          await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
          continue;
        }

        const data = await response.json();

        // Runtime validation with Zod if schema provided
        if (schema) {
          const result = schema.safeParse(data);
          if (!result.success) {
            console.error('API Response validation failed:', result.error);
            console.error('Actual API response data:', JSON.stringify(data, null, 2));
            throw new ApiError(
              'Invalid response format from server',
              500,
              'VALIDATION_ERROR'
            );
          }
          return result.data;
        }

        return data as T;
      } catch (error) {
        if (error instanceof ApiError) {
          lastError = error;
          if (attempt === maxRetries || !retryCondition(error)) {
            throw error;
          }
        } else {
          // Network errors, JSON parsing errors, etc.
          const apiError = new ApiError(
            error instanceof Error ? error.message : 'Unknown error',
            0,
            'NETWORK_ERROR'
          );
          
          if (attempt === maxRetries) {
            throw apiError;
          }
          lastError = apiError;
        }

        if (attempt < maxRetries) {
          await this.delay(retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError!;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async get<T>(
    endpoint: string,
    options: ApiClientOptions = {},
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    return this.makeRequest(
      endpoint,
      { ...options, method: 'GET' },
      schema
    );
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options: ApiClientOptions = {},
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    return this.makeRequest(
      endpoint,
      {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
        cache: 'no-store', // Don't cache mutations
      },
      schema
    );
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options: ApiClientOptions = {},
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    return this.makeRequest(
      endpoint,
      {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
        cache: 'no-store',
      },
      schema
    );
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options: ApiClientOptions = {},
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    return this.makeRequest(
      endpoint,
      {
        ...options,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
        cache: 'no-store',
      },
      schema
    );
  }

  async delete<T>(
    endpoint: string,
    options: ApiClientOptions = {},
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    return this.makeRequest(
      endpoint,
      {
        ...options,
        method: 'DELETE',
        cache: 'no-store',
      },
      schema
    );
  }
}

export const apiClient = new ApiClient();

// ✅ Removed CACHE_TAGS and CACHE_TIMES 
// SWR handles all caching for CSR endpoints!
