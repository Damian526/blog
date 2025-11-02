/**
 * Rate Limiting Utility for Server Actions
 * 
 * This implements a simple in-memory rate limiter using a sliding window approach.
 * For production, consider using Redis or a dedicated rate limiting service.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (e.g., user email or IP)
   * @param limit - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns Object with success flag and remaining requests
   */
  async check(
    identifier: string,
    limit: number,
    windowMs: number
  ): Promise<{ 
    success: boolean; 
    remaining: number;
    resetTime: Date;
  }> {
    const now = Date.now();
    const entry = this.store.get(identifier);

    // If no entry or expired, create new entry
    if (!entry || now > entry.resetTime) {
      const resetTime = now + windowMs;
      this.store.set(identifier, {
        count: 1,
        resetTime,
      });
      return {
        success: true,
        remaining: limit - 1,
        resetTime: new Date(resetTime),
      };
    }

    // Check if limit exceeded
    if (entry.count >= limit) {
      return {
        success: false,
        remaining: 0,
        resetTime: new Date(entry.resetTime),
      };
    }

    // Increment count
    entry.count++;
    this.store.set(identifier, entry);

    return {
      success: true,
      remaining: limit - entry.count,
      resetTime: new Date(entry.resetTime),
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Reset rate limit for a specific identifier
   */
  reset(identifier: string) {
    this.store.delete(identifier);
  }

  /**
   * Clear all rate limits (useful for testing)
   */
  clearAll() {
    this.store.clear();
  }

  /**
   * Cleanup interval on shutdown
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.store.clear();
  }
}

// Create singleton instance
const globalForRateLimit = global as unknown as { 
  rateLimiter: RateLimiter;
};

export const rateLimiter = globalForRateLimit.rateLimiter || new RateLimiter();

if (process.env.NODE_ENV !== 'production') {
  globalForRateLimit.rateLimiter = rateLimiter;
}

// Predefined rate limit configurations
export const rateLimitConfigs = {
  // Strict limits for write operations
  createPost: {
    limit: 5,
    windowMs: 60 * 60 * 1000, // 5 posts per hour
  },
  createComment: {
    limit: 20,
    windowMs: 60 * 60 * 1000, // 20 comments per hour
  },
  updatePost: {
    limit: 10,
    windowMs: 60 * 60 * 1000, // 10 updates per hour
  },
  deletePost: {
    limit: 10,
    windowMs: 60 * 60 * 1000, // 10 deletes per hour
  },
  // Less strict for auth operations
  login: {
    limit: 5,
    windowMs: 15 * 60 * 1000, // 5 attempts per 15 minutes
  },
  register: {
    limit: 3,
    windowMs: 60 * 60 * 1000, // 3 registrations per hour per IP
  },
  // Admin operations - moderate limits
  adminAction: {
    limit: 50,
    windowMs: 60 * 60 * 1000, // 50 actions per hour
  },
};

/**
 * Helper function to check rate limit for server actions
 */
export async function checkRateLimit(
  identifier: string,
  config: { limit: number; windowMs: number }
): Promise<{ 
  success: boolean; 
  remaining: number;
  resetTime: Date;
  error?: string;
}> {
  const result = await rateLimiter.check(identifier, config.limit, config.windowMs);
  
  if (!result.success) {
    const resetMinutes = Math.ceil((result.resetTime.getTime() - Date.now()) / 60000);
    return {
      ...result,
      error: `Too many requests. Please try again in ${resetMinutes} minute${resetMinutes !== 1 ? 's' : ''}.`,
    };
  }

  return result;
}
