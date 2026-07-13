import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { rateLimiter } from './middleware/rate-limiter';

type Bindings = {
  KV_STORE: KVNamespace;
  ACCOUNT_ID: string;
  TUNNEL_ID: string;
  CLOUDFLARE_API_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS configuration
app.use('*', cors({
  origin: ['https://cloudplay.lat', 'https://www.cloudplay.lat', 'http://localhost:1420', 'tauri://localhost'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  maxAge: 86400,
}));

// Apply rate limiter to API endpoints
app.use('/api/*', rateLimiter);

// Token issuance endpoint
app.post('/api/token', async (c) => {
  try {
    const body = await c.req.json();
    const { roomId } = body;

    // 1. Validate room ID format: alphanumeric, underscores, hyphens, 3-20 chars
    if (!roomId || !/^[a-zA-Z0-9_-]{3,20}$/.test(roomId)) {
      return c.json({
        success: false,
        error: 'Invalid room ID format. Use 3-20 characters (letters, numbers, underscores, hyphens).'
      }, 400);
    }

    const hostname = `${roomId}.cloudplay.lat`;
    const { ACCOUNT_ID, TUNNEL_ID, CLOUDFLARE_API_TOKEN } = c.env;

    // 2. Call Cloudflare API to generate tunnel token
    const resp = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/cfd_tunnel/${TUNNEL_ID}/tokens`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostname: hostname,
          ttl: 3600, // 1 hour validity
        })
      }
    );

    const data = await resp.json() as any;

    if (!data.success) {
      console.error('Cloudflare API error:', JSON.stringify(data.errors));
      return c.json({
        success: false,
        error: 'Failed to create tunnel token. Please try again later.'
      }, 500);
    }

    // 3. Return token
    return c.json({
      success: true,
      data: {
        hostname: hostname,
        token: data.result.token,
        expiresIn: 3600,
      }
    });

  } catch (error) {
    console.error('Token request error:', error);
    return c.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
});

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ success: false, error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ success: false, error: 'Internal server error' }, 500);
});

export default app;
