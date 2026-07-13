# Architecture

This document describes the technical architecture of CloudPlay.

## Overview

CloudPlay is a distributed system consisting of three main components:

1. **Backend Worker** - Cloudflare Workers for token issuance and rate limiting
2. **Desktop Client** - Tauri application for tunnel management
3. **Website** - Vue.js static site for documentation and downloads

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Devices                             │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │  Host GUI    │  │  Client GUI  │  │   Web Browser         │ │
│  │  React + TS  │  │  React + TS  │  │   Vue.js              │ │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬───────────┘ │
│         │                 │                       │             │
│  ┌──────┴─────────────────┴───────────────────────┴───────────┐ │
│  │                    Tauri Runtime                           │ │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────────────────┐│ │
│  │  │   Rust     │  │   Rust     │  │   WebView             ││ │
│  │  │  Backend   │  │  Backend   │  │   (React App)         ││ │
│  │  └──────┬─────┘  └──────┬─────┘  └───────────────────────┘│ │
│  └─────────┼───────────────┼─────────────────────────────────┘ │
│            │               │                                   │
│  ┌─────────┴───────────────┴─────────────────────────────────┐ │
│  │              cloudflared Process                          │ │
│  │  ┌────────────────┐  ┌────────────────┐                  │ │
│  │  │  Tunnel Mode   │  │  Access Mode   │                  │ │
│  │  │  (Host)        │  │  (Client)      │                  │ │
│  │  └────────┬───────┘  └────────┬───────┘                  │ │
│  └───────────┼───────────────────┼──────────────────────────┘ │
└──────────────┼───────────────────┼────────────────────────────┘
               │                   │
               ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare Edge Network                       │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │   Workers    │  │      KV      │  │      Tunnel           │ │
│  │  ┌────────┐  │  │  ┌────────┐  │  │  ┌─────────────────┐  │ │
│  │  │  Hono  │  │  │  │ Rate   │  │  │  │  Wildcard DNS   │  │ │
│  │  │ Routes │  │  │  │ Limit  │  │  │  │  *.cloudplay.app│  │ │
│  │  └────────┘  │  │  └────────┘  │  │  └─────────────────┘  │ │
│  │  ┌────────┐  │  │  ┌────────┐  │  │  ┌─────────────────┐  │ │
│  │  │ Token  │  │  │  │ Black- │  │  │  │  Traffic        │  │ │
│  │  │ Issue  │  │  │  │ list   │  │  │  │  Forwarding     │  │ │
│  │  └────────┘  │  │  └────────┘  │  │  └─────────────────┘  │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Backend Worker

The backend worker is a Cloudflare Worker built with Hono framework.

#### Responsibilities

- **Token Issuance**: Generate short-lived tunnel tokens
- **Rate Limiting**: Prevent abuse via IP-based rate limiting
- **Input Validation**: Validate room ID format
- **Health Checks**: Provide health check endpoint

#### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/token` | POST | Generate tunnel token |
| `/api/health` | GET | Health check |

#### Data Flow

```
Client Request → CORS Check → Rate Limit Check → Input Validation → Cloudflare API → Token Response
```

#### Storage

- **KV Store**: Rate limiting counters, blacklists

### 2. Desktop Client

The desktop client is a Tauri v2 application with React frontend and Rust backend.

#### Frontend (React + TypeScript)

- **Components**: Reusable UI components
- **Pages**: Host and Client modes
- **State Management**: Zustand store
- **Services**: API and Tauri IPC services

#### Backend (Rust)

- **Commands**: Tauri command handlers
- **Services**: Core business logic
- **Models**: Data structures

#### Key Services

| Service | Description |
|---------|-------------|
| `TunnelManager` | Manage cloudflared process lifecycle |
| `ApiClient` | Communicate with Worker API |
| `CredentialStore` | Secure token storage via OS keychain |
| `PortScanner` | Detect available ports |

### 3. Website

The website is a Vue.js static site deployed on Cloudflare Pages.

#### Components

- `Header`: Navigation with scroll effects
- `Hero`: Animated landing section
- `Features`: Feature showcase
- `HowItWorks`: Step-by-step guide
- `Download`: Multi-platform download
- `Footer`: Links and copyright

## Data Flow

### Host Mode

```
1. User enters room ID
2. Frontend calls Rust command
3. Rust calls Worker API for token
4. Worker validates and issues token
5. Rust starts cloudflared with token
6. cloudflared establishes tunnel
7. User receives shareable address
```

### Client Mode

```
1. User enters host address
2. Frontend calls Rust command
3. Rust starts cloudflared access
4. cloudflared connects to tunnel
5. Local proxy is established
6. User connects to localhost:port
```

## Security Architecture

### Token Security

```
┌─────────────────────────────────────────────────┐
│                Token Lifecycle                  │
│                                                 │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    │
│  │ Request │───▶│ Issue   │───▶│  Use    │    │
│  │         │    │ (1hr)   │    │         │    │
│  └─────────┘    └─────────┘    └─────────┘    │
│       │              │              │          │
│       ▼              ▼              ▼          │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    │
│  │ Validate│    │ Store   │    │ Expire  │    │
│  │ Input   │    │ (KV)    │    │         │    │
│  └─────────┘    └─────────┘    └─────────┘    │
└─────────────────────────────────────────────────┘
```

### Security Layers

| Layer | Protection |
|-------|------------|
| **Network** | HTTPS everywhere (Cloudflare TLS) |
| **Application** | Input validation, rate limiting |
| **Storage** | OS keychain for tokens |
| **Process** | Rust binary (hard to reverse engineer) |

## Scalability

### Worker Scaling

- **Automatic**: Cloudflare Workers scale automatically
- **Edge Locations**: 300+ global edge nodes
- **Rate Limits**: 100K requests/day (free tier)

### Tunnel Scaling

- **Per User**: Each user gets a unique tunnel
- **Bandwidth**: Unlimited (Cloudflare ToS)
- **Connections**: Limited by Cloudflare Tunnel capacity

## Monitoring

### Metrics

| Metric | Source | Purpose |
|--------|--------|---------|
| API Latency | Workers Analytics | Performance monitoring |
| Error Rate | Workers Analytics | Reliability monitoring |
| Token Issuance | Custom logs | Usage tracking |
| Tunnel Status | Client logs | Connection quality |

### Alerting

- **HTTP 5xx**: Error rate threshold
- **Latency**: Response time threshold
- **Rate Limit**: Abuse detection

## Technology Decisions

### Why Tauri over Electron?

| Aspect | Tauri | Electron |
|--------|-------|----------|
| Bundle Size | ~10MB | ~150MB |
| Memory Usage | ~50MB | ~200MB |
| Startup Time | Fast | Slow |
| Security | Rust backend | Node.js backend |
| Native Feel | Yes | No |

### Why Cloudflare over AWS/GCP?

| Aspect | Cloudflare | AWS/GCP |
|--------|------------|---------|
| Free Tier | Generous | Limited |
| Edge Network | 300+ nodes | Regional |
| Latency | Low (edge) | Higher |
| Complexity | Low | High |
| Cost | Free | Pay-as-you-go |

### Why Hono over Express?

| Aspect | Hono | Express |
|--------|------|---------|
| Size | ~14KB | ~200KB |
| Performance | Fast | Moderate |
| Edge Support | Native | Limited |
| TypeScript | First-class | Optional |
| Middleware | Built-in | Plugin-based |

## Future Architecture

### Planned Improvements

1. **User System**: Cloudflare D1 for user accounts
2. **Room Persistence**: Save room configurations
3. **Traffic Analytics**: Per-tunnel bandwidth tracking
4. **Multi-Game Support**: Beyond LAN games
5. **Mobile Clients**: iOS and Android support

### Scalability Roadmap

1. **Phase 1**: Current architecture (free tier)
2. **Phase 2**: Paid Cloudflare plan for higher limits
3. **Phase 3**: Custom infrastructure if needed
