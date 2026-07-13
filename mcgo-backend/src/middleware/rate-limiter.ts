import { MiddlewareHandler } from 'hono';

interface RateLimitRecord {
  count: number;
  timestamp: number;
}

export const rateLimiter: MiddlewareHandler = async (c, next) => {
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
  const key = `ratelimit:${ip}`;
  const kv = c.env.KV_STORE;

  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 10; // Max requests per window

  try {
    // Get current count and timestamp
    const recordStr = await kv.get(key);
    const record: RateLimitRecord | null = recordStr ? JSON.parse(recordStr) : null;

    // If record doesn't exist or has expired, reset count
    if (!record || (now - record.timestamp) > windowMs) {
      await kv.put(key, JSON.stringify({ count: 1, timestamp: now }), { expirationTtl: 120 });
      await next();
      return;
    }

    // Check if rate limit exceeded
    if (record.count >= maxRequests) {
      const retryAfter = Math.ceil((windowMs - (now - record.timestamp)) / 1000);
      c.header('Retry-After', retryAfter.toString());
      return c.json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      }, 429);
    }

    // Increment count
    await kv.put(key, JSON.stringify({ count: record.count + 1, timestamp: record.timestamp }), { expirationTtl: 120 });
    await next();

  } catch (error) {
    // If KV fails, allow the request but log the error
    console.error('Rate limiter error:', error);
    await next();
  }
};
