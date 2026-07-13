# API Documentation

This document describes the CloudPlay Worker API.

## Base URL

```
Production: https://api.cloudplay.app
Development: http://localhost:8787
```

## Authentication

The API uses API tokens for authentication. Tokens are generated per session and have a 1-hour lifetime.

## Endpoints

### Generate Token

Generate a tunnel token for a specific room.

**Endpoint:** `POST /api/token`

**Request Headers:**

| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | Yes |
| `CF-Connecting-IP` | Client IP | Auto |

**Request Body:**

```json
{
  "roomId": "myserver"
}
```

**Request Body Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `roomId` | string | Yes | Room identifier (3-20 chars, alphanumeric, underscores, hyphens) |

**Validation Rules:**

- Length: 3-20 characters
- Allowed characters: `[a-zA-Z0-9_-]`
- No spaces or special characters

**Response (Success):**

```json
{
  "success": true,
  "data": {
    "hostname": "myserver.cloudplay.app",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

**Response Schema:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` for successful requests |
| `data.hostname` | string | Full hostname for the tunnel |
| `data.token` | string | Tunnel token (JWT format) |
| `data.expiresIn` | number | Token lifetime in seconds |

**Response (Error):**

```json
{
  "success": false,
  "error": "Invalid room ID format"
}
```

**Error Codes:**

| Status Code | Error Message | Description |
|-------------|---------------|-------------|
| 400 | `Invalid room ID format` | Room ID doesn't meet validation rules |
| 429 | `Rate limit exceeded` | Too many requests |
| 500 | `Failed to create tunnel token` | Cloudflare API error |

**Example cURL:**

```bash
curl -X POST https://api.cloudplay.app/api/token \
  -H "Content-Type: application/json" \
  -d '{"roomId": "myserver"}'
```

**Example JavaScript:**

```typescript
const response = await fetch('https://api.cloudplay.app/api/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ roomId: 'myserver' }),
});

const data = await response.json();

if (data.success) {
  console.log('Hostname:', data.data.hostname);
  console.log('Token:', data.data.token);
} else {
  console.error('Error:', data.error);
}
```

**Example Rust:**

```rust
use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct TokenRequest {
    room_id: String,
}

#[derive(Deserialize)]
struct TokenResponse {
    success: bool,
    data: Option<TokenData>,
    error: Option<String>,
}

#[derive(Deserialize)]
struct TokenData {
    hostname: String,
    token: String,
    expires_in: u64,
}

async fn request_token(room_id: &str) -> Result<TokenResponse, reqwest::Error> {
    let client = Client::new();
    let response = client
        .post("https://api.cloudplay.app/api/token")
        .json(&TokenRequest {
            room_id: room_id.to_string(),
        })
        .send()
        .await?
        .json::<TokenResponse>()
        .await?;

    Ok(response)
}
```

---

### Health Check

Check if the API is healthy.

**Endpoint:** `GET /api/health`

**Request Headers:**

None required.

**Response (Success):**

```json
{
  "status": "ok",
  "timestamp": "2026-07-13T12:00:00.000Z",
  "version": "1.0.0"
}
```

**Response Schema:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always `"ok"` for healthy service |
| `timestamp` | string | ISO 8601 timestamp |
| `version` | string | API version |

**Example cURL:**

```bash
curl https://api.cloudplay.app/api/health
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse.

### Limits

| Limit | Value | Window |
|-------|-------|--------|
| Requests per IP | 10 | 1 minute |

### Headers

Rate limit information is included in response headers:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests per window |
| `X-RateLimit-Remaining` | Remaining requests in window |
| `X-RateLimit-Reset` | Time when the window resets (Unix timestamp) |
| `Retry-After` | Seconds to wait (only on 429 responses) |

### Rate Limit Exceeded

When rate limit is exceeded, the API returns:

**Status Code:** `429 Too Many Requests`

**Response:**

```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later."
}
```

---

## Error Handling

### Error Response Format

All errors follow the same format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Errors

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Bad Request | Invalid request body or parameters |
| 404 | Not Found | Endpoint does not exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

---

## CORS

The API supports Cross-Origin Resource Sharing (CORS) for the following origins:

- `https://cloudplay.app`
- `https://www.cloudplay.app`
- `http://localhost:1420` (Tauri dev)
- `tauri://localhost` (Tauri production)

### Allowed Methods

- `POST`
- `GET`
- `OPTIONS`

### Allowed Headers

- `Content-Type`

---

## Security Considerations

### Token Security

- Tokens are bound to specific hostnames
- Tokens expire after 1 hour
- Tokens are stored in OS keychain on client

### Input Validation

- Room IDs are validated against regex: `[a-zA-Z0-9_-]{3,20}`
- All inputs are sanitized before processing

### Rate Limiting

- IP-based rate limiting prevents brute force attacks
- Rate limit counters stored in Cloudflare KV

---

## Development

### Local Development

Start the Worker locally:

```bash
cd cloudplay-backend
pnpm install
pnpm run dev
```

The API will be available at `http://localhost:8787`.

### Testing

```bash
# Run tests
pnpm run test

# Test token endpoint
curl -X POST http://localhost:8787/api/token \
  -H "Content-Type: application/json" \
  -d '{"roomId": "test123"}'

# Test health endpoint
curl http://localhost:8787/api/health
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ACCOUNT_ID` | Cloudflare Account ID | Yes |
| `TUNNEL_ID` | Cloudflare Tunnel UUID | Yes |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token | Yes (via secret) |
| `KV_STORE` | KV Namespace binding | Yes |

---

## SDKs

### JavaScript/TypeScript SDK

```typescript
import { CloudPlayClient } from '@cloudplay/sdk';

const client = new CloudPlayClient({
  baseUrl: 'https://api.cloudplay.app',
});

// Generate token
const { hostname, token } = await client.generateToken('myserver');

// Check health
const health = await client.healthCheck();
```

### Rust SDK

```rust
use cloudplay_sdk::CloudPlayClient;

let client = CloudPlayClient::new("https://api.cloudplay.app");

// Generate token
let token = client.generate_token("myserver").await?;

// Check health
let health = client.health_check().await?;
```

---

## Changelog

### v1.0.0 (2026-07-13)

- Initial API release
- Token issuance endpoint
- Health check endpoint
- Rate limiting via KV
- CORS support
