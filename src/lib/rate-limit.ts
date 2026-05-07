import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache for rate limiting
// Note: In serverless environments, this is per-instance.
const cache = new Map<string, { hits: number; resetAt: number }>();

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = { limit: 10, windowMs: 60 * 1000 } // Default: 10 requests per minute
) {
  const ip = (request as any).ip || request.headers.get('x-forwarded-for') || 'anonymous';
  const key = `rl_${ip}_${request.nextUrl.pathname}`;
  
  const now = Date.now();
  const data = cache.get(key);

  if (!data || now > data.resetAt) {
    // Fresh start or reset
    cache.set(key, { hits: 1, resetAt: now + config.windowMs });
    return { success: true, remaining: config.limit - 1 };
  }

  if (data.hits >= config.limit) {
    // Limit exceeded
    return { 
      success: false, 
      remaining: 0,
      resetInSeconds: Math.ceil((data.resetAt - now) / 1000)
    };
  }

  // Increment hits
  data.hits += 1;
  cache.set(key, data);
  
  return { success: true, remaining: config.limit - data.hits };
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of cache.entries()) {
    if (now > data.resetAt) {
      cache.delete(key);
    }
  }
}, 5 * 60 * 1000); // Every 5 minutes
