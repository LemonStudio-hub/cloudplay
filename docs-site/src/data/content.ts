export const docs: Record<string, string> = {
  'guide/introduction': `# Introduction

CloudPlay is an open-source remote play platform designed for LAN games. Built on Cloudflare's global network, it provides zero-configuration, low-latency remote play experience.

## Why CloudPlay?

### The Problem

LAN games are great for local multiplayer, but friends in different locations cannot connect directly. Traditional solutions like port forwarding or VPNs have high technical barriers, while existing free tunneling services are often unreliable or have high latency.

### The Solution

CloudPlay solves this by:

- **One-Click Hosting**: Create a tunnel with a single click
- **Zero Configuration**: No port forwarding, no VPN, no public IP
- **Global Network**: Cloudflare's 300+ edge nodes for low latency
- **Completely Free**: Leverages Cloudflare's free tier
- **Secure**: End-to-end encryption with secure token storage

## Features

### Core Features

| Feature | Description |
|---------|-------------|
| One-Click Hosting | Input room ID, click start, get shareable address |
| One-Click Connection | Input address, click connect, join game |
| Global Acceleration | Cloudflare edge network intelligent routing |
| Secure Storage | OS-level keychain for token storage |
| Real-time Logs | Live tunnel status feedback |
| Port Detection | Automatic port availability detection |

### Technical Features

| Feature | Implementation |
|---------|---------------|
| Cross-Platform | Tauri v2 supports Windows, macOS, Linux |
| Native Performance | Rust backend, low memory, fast startup |
| Modern UI | React + TailwindCSS, responsive design |
| Edge Computing | Cloudflare Workers, API at the edge |
| Wildcard DNS | Dynamic subdomain allocation |

## Architecture Overview

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    User Devices                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │
│  │ Host GUI │  │ Client   │  │ Web Browser          │ │
│  │ React    │  │ GUI      │  │ Vue.js               │ │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘ │
│       │              │                   │             │
│  ┌────┴──────────────┴───────────────────┴───────────┐ │
│  │               Tauri Runtime                       │ │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │ │
│  │  │ Rust     │  │ Rust     │  │ WebView        │  │ │
│  │  │ Backend  │  │ Backend  │  │ (React App)    │  │ │
│  │  └────┬─────┘  └────┬─────┘  └────────────────┘  │ │
│  └───────┼──────────────┼────────────────────────────┘ │
│          │              │                              │
│  ┌───────┴──────────────┴────────────────────────────┐ │
│  │           cloudflared Process                     │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
\`\`\`

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Vue.js | 3.5 | Documentation site |
| React | 18.3 | Client UI |
| TypeScript | 5.9 | Type safety |
| TailwindCSS | 3.4 | Styling |
| Vite | 6.4 | Build tool |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Rust | 1.96 | Client backend |
| Tauri | 2.x | Desktop framework |
| Tokio | 1.x | Async runtime |
| Hono | 4.x | Worker framework |
| Cloudflare Workers | - | Edge computing |
| Cloudflare Tunnel | - | Tunnel service |

## Getting Started

Ready to get started? Check out the [Quick Start](/guide/quick-start) guide.

## Contributing

We welcome contributions! See our [Contributing](/development/contributing) guide.

## License

CloudPlay is licensed under the [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0).
`,

  'guide/quick-start': `# Quick Start

Get CloudPlay up and running in minutes.

## Prerequisites

Before you begin, make sure you have:

- **Node.js** >= 18
- **pnpm** >= 8
- **Rust** >= 1.70 (for desktop client)
- **Git** (for cloning the repository)

## Step 1: Clone the Repository

\`\`\`bash
git clone https://github.com/cloudplay/cloudplay.git
cd cloudplay
\`\`\`

## Step 2: Install Dependencies

Install dependencies for all projects:

\`\`\`bash
pnpm install
\`\`\`

Or install individually:

\`\`\`bash
# Backend Worker
cd cloudplay-backend && pnpm install

# Desktop Client
cd ../cloudplay-app && pnpm install

# Website
cd ../cloudplay-website && pnpm install
\`\`\`

## Step 3: Start Development Servers

### Option A: Start All Services

\`\`\`bash
pnpm run dev:all
\`\`\`

### Option B: Start Individual Services

**Terminal 1 - Backend Worker:**

\`\`\`bash
cd cloudplay-backend
pnpm run dev
\`\`\`

The Worker will start at \`http://localhost:8787\`.

**Terminal 2 - Desktop Client:**

\`\`\`bash
cd cloudplay-app
pnpm run tauri dev
\`\`\`

**Terminal 3 - Website:**

\`\`\`bash
cd cloudplay-website
pnpm run dev
\`\`\`

The website will start at \`http://localhost:5173\`.

## Step 4: Test the Setup

### Test Backend API

\`\`\`bash
# Health check
curl http://localhost:8787/api/health

# Generate token
curl -X POST http://localhost:8787/api/token \\
  -H "Content-Type: application/json" \\
  -d '{"roomId": "test123"}'
\`\`\`

### Test Desktop Client

1. Open the Tauri application
2. Enter a room ID (e.g., "myserver")
3. Click "Start Tunnel"
4. Verify the tunnel starts successfully

## Next Steps

- Read the [Installation](/guide/installation) guide for production setup
- Learn about [Configuration](/guide/configuration) options
- Explore the [Architecture](/architecture/overview) to understand how it works
`,

  'guide/installation': `# Installation

This guide covers installing CloudPlay for production use.

## Download

Download the latest release for your platform from the [official website](https://cloudplay.lat).

### Windows

1. Download \`.msi\` or \`.exe\` installer
2. Run the installer
3. Follow the on-screen instructions

::callout[warning]
Windows SmartScreen may show a warning because the app is not yet code-signed. Click "More info" then "Run anyway".
::

### macOS

1. Download \`.dmg\` file
2. Open the DMG and drag CloudPlay to Applications
3. Right-click the app and select "Open" on first launch

::callout[warning]
macOS may show a warning about unidentified developer. Right-click and select "Open" to bypass.
::

### Linux

**Debian/Ubuntu:**

\`\`\`bash
# Download .deb package
wget https://cloudplay.lat/releases/cloudplay_1.0.0_amd64.deb

# Install
sudo dpkg -i cloudplay_1.0.0_amd64.deb

# Install dependencies if needed
sudo apt-get install -f
\`\`\`

**AppImage:**

\`\`\`bash
# Download AppImage
wget https://cloudplay.lat/releases/cloudplay_1.0.0_amd64.AppImage

# Make executable
chmod +x cloudplay_1.0.0_amd64.AppImage

# Run
./cloudplay_1.0.0_amd64.AppImage
\`\`\`

## System Requirements

### Minimum

| Requirement | Value |
|-------------|-------|
| OS | Windows 10, macOS 12, Ubuntu 20.04 |
| RAM | 2 GB |
| Disk | 100 MB |
| Network | Internet connection |

### Recommended

| Requirement | Value |
|-------------|-------|
| OS | Windows 11, macOS 14, Ubuntu 22.04 |
| RAM | 4 GB |
| Disk | 500 MB |
| Network | Broadband |

## Verification

After installation, verify CloudPlay is working:

1. Launch the application
2. Check that the UI loads correctly
3. Try creating a test tunnel

## Updating

CloudPlay will automatically check for updates. You can also:

1. Download the latest version
2. Install over the existing installation
3. Settings and data will be preserved

## Uninstalling

### Windows

1. Open Settings > Apps
2. Find CloudPlay
3. Click Uninstall

### macOS

1. Open Finder > Applications
2. Drag CloudPlay to Trash
3. Empty Trash

### Linux

\`\`\`bash
# Debian/Ubuntu
sudo apt remove cloudplay

# Or remove AppImage
rm ~/cloudplay_1.0.0_amd64.AppImage
\`\`\`

## Next Steps

- Learn about [Configuration](/guide/configuration) options
- Read the [Quick Start](/guide/quick-start) guide
`,

  'guide/configuration': `# Configuration

This guide covers configuring CloudPlay for your needs.

## Application Settings

### General Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Language | English | Interface language |
| Theme | Dark | UI theme (Dark/Light) |
| Auto-start | No | Start on system boot |
| Minimize to tray | Yes | Minimize to system tray |

### Network Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Local Port | 25565 | Default port for game server |
| Proxy Port | 25566 | Default port for client proxy |
| API Endpoint | api.cloudplay.lat | Backend API URL |

## Environment Variables

### Backend Worker

Configure in \`cloudplay-backend/wrangler.toml\`:

\`\`\`toml
[vars]
ACCOUNT_ID = "your_cloudflare_account_id"
TUNNEL_ID = "your_tunnel_uuid"
\`\`\`

Set sensitive variables via Wrangler Secret:

\`\`\`bash
cd cloudplay-backend
wrangler secret put CLOUDFLARE_API_TOKEN
\`\`\`

### Desktop Client

Configure API endpoint in \`cloudplay-app/src-tauri/src/lib.rs\`:

\`\`\`rust
let api_client = ApiClient::new("https://api.cloudplay.lat".to_string());
\`\`\`

## Cloudflare Configuration

### Domain Setup

1. Register domain in Cloudflare
2. Add domain to your Cloudflare account
3. Configure DNS records

### Tunnel Setup

1. Go to Zero Trust Dashboard
2. Networks > Tunnels > Create a tunnel
3. Copy the Tunnel UUID

### KV Namespace

Create a KV namespace for rate limiting:

\`\`\`bash
wrangler kv namespace create "KV_STORE"
\`\`\`

## Advanced Configuration

### Custom API Endpoint

To use a custom API endpoint:

1. Deploy your own Worker
2. Update the API URL in client configuration
3. Rebuild the client

### Custom Domain

To use a custom domain:

1. Configure DNS in Cloudflare
2. Update Worker routes
3. Update client configuration

## Configuration Files

### wrangler.toml

\`\`\`toml
name = "cloudplay-backend"
main = "src/index.ts"
compatibility_date = "2024-12-18"

[[kv_namespaces]]
binding = "KV_STORE"
id = "your_kv_namespace_id"

[vars]
ACCOUNT_ID = "your_account_id"
TUNNEL_ID = "your_tunnel_id"
\`\`\`

### tauri.conf.json

\`\`\`json
{
  "productName": "CloudPlay",
  "version": "1.0.0",
  "identifier": "app.cloudplay.lat",
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build"
  }
}
\`\`\`

## Next Steps

- Learn about the [Architecture](/architecture/overview)
- Read the [Deployment](/deployment/overview) guide
`,

  'guide/faq': `# Frequently Asked Questions

## General

### What is CloudPlay?

CloudPlay is an open-source remote play platform for LAN games. It uses Cloudflare Tunnel to create secure connections between players without port forwarding or VPNs.

### Is CloudPlay free?

Yes! CloudPlay is completely free. It leverages Cloudflare's free tier, which provides generous limits for most use cases.

### What games does CloudPlay support?

CloudPlay supports any game with LAN multiplayer, including Minecraft, Terraria, Factorio, Stardew Valley, and more.

### Is CloudPlay open source?

Yes! CloudPlay is open source under the AGPL-3.0 license.

## Usage

### How do I host a game?

1. Open CloudPlay
2. Select "Host" mode
3. Enter a room ID
4. Click "Start Tunnel"
5. Share the address with friends

### How do I join a game?

1. Open CloudPlay
2. Select "Client" mode
3. Enter the host's address
4. Click "Connect"
5. Connect to localhost in your game

### What is the room ID?

The room ID is a unique identifier for your session. It becomes part of your address (e.g., \`myserver.cloudplay.lat\`).

**Rules:**
- 3-20 characters
- Letters, numbers, underscores, hyphens only

### Why can't I connect?

Common reasons:
- Wrong address
- Firewall blocking
- Game not running
- Port conflict

## Technical

### How does CloudPlay work?

CloudPlay uses Cloudflare Tunnel to create a secure tunnel between players. Traffic is encrypted and routed through Cloudflare's global network.

### Is my data secure?

Yes! All traffic is encrypted via HTTPS. Tokens are stored in OS keychain and expire after 1 hour.

### Do I need to open ports?

No! CloudPlay works behind NAT and firewalls without port forwarding.

## Troubleshooting

### "Failed to spawn cloudflared"

This means the cloudflared binary is missing or blocked.

**Solution:**
1. Reinstall the app
2. Check antivirus settings
3. Manually install cloudflared

### "Port already in use"

Another application is using the port.

**Solution:**
1. Change the port in settings
2. Find and close the conflicting application
3. Use a different port number

### Connection is slow

**Solution:**
1. Check your internet connection
2. Use wired connection instead of WiFi
3. Close bandwidth-heavy applications

## Getting Help

- **GitHub Discussions**: Ask questions
- **Discord**: Join our community
- **Email**: support@cloudplay.lat
`,

  'guide/troubleshooting': `# Troubleshooting

This guide helps you diagnose and fix common issues.

## Quick Diagnostics

### Check Application Status

\`\`\`bash
# Check if cloudflared is running
ps aux | grep cloudflared

# Check logs
tail -f ~/.cloudplay/logs/app.log
\`\`\`

### Check Network

\`\`\`bash
# Test internet
ping -c 4 1.1.1.1

# Test API
curl https://api.cloudplay.lat/api/health
\`\`\`

## Installation Issues

### Windows SmartScreen Warning

**Symptom:** "Windows protected your PC" warning

**Solution:**
1. Click "More info"
2. Click "Run anyway"

### macOS Unidentified Developer

**Symptom:** Cannot open app from unidentified developer

**Solution:**
1. Right-click the app
2. Select "Open"
3. Click "Open" in dialog

### Linux Missing Dependencies

**Symptom:** App fails to start with library errors

**Solution:**

\`\`\`bash
# Ubuntu/Debian
sudo apt install libdbus-1-dev libwebkit2gtk-4.1-dev libgtk-3-dev

# Fedora
sudo dnf install dbus-devel webkit2gtk4.1-devel gtk3-devel
\`\`\`

## Connection Issues

### Failed to spawn cloudflared

**Causes:**
- Binary not found
- Binary corrupted
- Antivirus blocking

**Solution:**
1. Reinstall the app
2. Check antivirus settings
3. Manually install cloudflared

### Port already in use

**Solution:**

\`\`\`bash
# Find process using port
lsof -i :25565

# Kill process
kill -9 <PID>
\`\`\`

### Connection refused

**Causes:**
- Host tunnel not running
- Wrong address
- Firewall blocking

**Solution:**
1. Verify host is running
2. Check address format
3. Check firewall settings

### Connection timeout

**Causes:**
- Network issues
- Cloudflare issues

**Solution:**
1. Check internet connection
2. Try different network
3. Check Cloudflare status

## Performance Issues

### High Latency

**Solution:**
1. Use wired connection
2. Close background apps
3. Optimize game settings

### Disconnections

**Solution:**
1. Check internet stability
2. Disable VPN
3. Use wired connection

## API Issues

### Rate limit exceeded

**Solution:** Wait 1 minute for rate limit to reset.

### Invalid room ID

**Solution:** Use 3-20 characters, letters/numbers/underscores/hyphens only.

## Getting Help

If you cannot resolve the issue:

1. Search [GitHub Issues](https://github.com/cloudplay/cloudplay/issues)
2. Ask in [GitHub Discussions](https://github.com/cloudplay/cloudplay/discussions)
3. Join our [Discord](https://discord.gg/cloudplay)
`,

  'guide/changelog': `# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-07-13

### Added

#### Backend (Cloudflare Worker)
- Token issuance API with Hono framework
- Rate limiting middleware using Cloudflare KV
- Health check endpoint
- CORS configuration
- Input validation for room IDs

#### Desktop Client (Tauri)
- Cross-platform support (Windows, macOS, Linux)
- Tunnel manager for cloudflared process management
- Secure token storage using OS keychain
- Port scanner for automatic port detection
- Host mode with one-click tunnel creation
- Client mode with one-click connection
- Real-time tunnel status display

#### Website (Vue.js)
- Modern, responsive landing page
- Hero section with animations
- Features showcase
- How it works section
- Multi-platform download section

#### Documentation
- Comprehensive README
- API documentation
- Contributing guidelines
- Code of conduct
- Security policy
- Platform-specific build guides

### Security
- Token expiration: 1 hour
- Rate limiting: 10 requests per minute per IP
- Input sanitization for room IDs
- Secure token storage in OS keychain

## [0.1.0] - 2026-07-12

### Added
- Initial project scaffolding
- Basic project structure
- Development environment setup
`,

  'architecture/overview': `# Architecture Overview

This document describes the technical architecture of CloudPlay.

## System Architecture

\`\`\`
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
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## Components

### Backend Worker

A Cloudflare Worker built with Hono framework.

**Responsibilities:**
- Token issuance
- Rate limiting
- Input validation
- Health checks

### Desktop Client

A Tauri v2 application with React frontend and Rust backend.

**Frontend (React + TypeScript):**
- UI components
- State management (Zustand)
- API services

**Backend (Rust):**
- Process management
- Secure storage
- Port scanning

### Website

A Vue.js static site deployed on Cloudflare Pages.

**Components:**
- Landing page
- Documentation
- Download links

## Data Flow

### Host Mode

1. User enters room ID
2. Frontend calls Rust command
3. Rust calls Worker API for token
4. Worker validates and issues token
5. Rust starts cloudflared with token
6. cloudflared establishes tunnel
7. User receives shareable address

### Client Mode

1. User enters host address
2. Frontend calls Rust command
3. Rust starts cloudflared access
4. cloudflared connects to tunnel
5. Local proxy is established
6. User connects to localhost:port

## Security Architecture

### Token Lifecycle

1. **Request**: Client requests token with room ID
2. **Validation**: Worker validates room ID format
3. **Issuance**: Worker generates token via Cloudflare API
4. **Storage**: Client stores token in OS keychain
5. **Usage**: Token used to establish tunnel
6. **Expiration**: Token expires after 1 hour

### Security Layers

| Layer | Protection |
|-------|------------|
| Network | HTTPS everywhere |
| Application | Input validation, rate limiting |
| Storage | OS keychain for tokens |
| Process | Rust binary (hard to reverse) |

## Technology Decisions

### Why Tauri over Electron?

| Aspect | Tauri | Electron |
|--------|-------|----------|
| Bundle Size | ~10MB | ~150MB |
| Memory | ~50MB | ~200MB |
| Startup | Fast | Slow |
| Security | Rust backend | Node.js backend |

### Why Cloudflare?

| Aspect | Cloudflare | AWS/GCP |
|--------|------------|---------|
| Free Tier | Generous | Limited |
| Edge Network | 300+ nodes | Regional |
| Latency | Low | Higher |
| Complexity | Low | High |
`,

  'architecture/backend': `# Backend Worker

The backend worker is a Cloudflare Worker built with Hono framework.

## Overview

The Worker handles:
- Token issuance for tunnel creation
- Rate limiting to prevent abuse
- Input validation
- Health checks

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| Hono | Lightweight web framework |
| Cloudflare Workers | Edge computing platform |
| Cloudflare KV | Key-value storage for rate limiting |
| TypeScript | Type-safe development |

## API Endpoints

### POST /api/token

Generate a tunnel token.

**Request:**

\`\`\`json
{
  "roomId": "myserver"
}
\`\`\`

**Response:**

\`\`\`json
{
  "success": true,
  "data": {
    "hostname": "myserver.cloudplay.lat",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
\`\`\`

### GET /api/health

Health check endpoint.

**Response:**

\`\`\`json
{
  "status": "ok",
  "timestamp": "2026-07-13T12:00:00.000Z",
  "version": "1.0.0"
}
\`\`\`

## Rate Limiting

Rate limiting is implemented using Cloudflare KV.

**Configuration:**
- 10 requests per minute per IP
- Sliding window implementation
- Automatic cleanup of expired entries

## Security

### Input Validation

Room IDs are validated against:
- Length: 3-20 characters
- Characters: \`[a-zA-Z0-9_-]\`

### CORS

Only allowed origins can access the API:
- \`https://cloudplay.lat\`
- \`https://www.cloudplay.lat\`
- \`tauri://localhost\` (desktop client)

## Deployment

See [Worker Deployment](/deployment/worker) for details.
`,

  'architecture/client': `# Desktop Client

The desktop client is a Tauri v2 application with React frontend and Rust backend.

## Overview

The client provides:
- GUI for tunnel management
- Process management for cloudflared
- Secure token storage
- Port detection

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| Tauri v2 | Desktop framework |
| React 18 | UI framework |
| TypeScript | Type-safe development |
| Rust | Backend logic |
| Tokio | Async runtime |

## Architecture

\`\`\`
┌─────────────────────────────────────────┐
│              Tauri App                  │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │ React UI    │  │ Rust Backend    │  │
│  │ - Components│  │ - Commands      │  │
│  │ - State     │←→│ - Services      │  │
│  │ - Services  │  │ - Models        │  │
│  └─────────────┘  └────────┬────────┘  │
│                            │           │
│  ┌─────────────────────────┴────────┐  │
│  │       cloudflared Process        │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
\`\`\`

## Frontend Components

### Pages

- **HostPage**: Create and manage tunnels
- **ClientPage**: Connect to tunnels

### State Management

Uses Zustand for state management:
- Tunnel status
- Connection info
- User settings

## Backend Services

### TunnelManager

Manages cloudflared process lifecycle:
- Start tunnel with token
- Stop tunnel
- Check tunnel status
- Stream logs

### ApiClient

Communicates with Worker API:
- Request tokens
- Health checks

### CredentialStore

Secure token storage:
- Store tokens in OS keychain
- Retrieve tokens
- Delete tokens

### PortScanner

Port detection:
- Check port availability
- Find available ports

## Tauri Commands

Commands exposed to frontend:

\`\`\`typescript
// Start tunnel
invoke('start_tunnel', { request: { room_id, local_port } })

// Stop tunnel
invoke('stop_tunnel')

// Check port
invoke('check_port', { port })
\`\`\`

## Security

- Tokens stored in OS keychain
- Rust binary difficult to reverse engineer
- All IPC calls validated
`,

  'architecture/website': `# Website

The website is a Vue.js static site deployed on Cloudflare Pages.

## Overview

The website provides:
- Landing page with product information
- Download links for all platforms
- Documentation (this site)

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| Vue.js 3 | UI framework |
| TypeScript | Type-safe development |
| TailwindCSS | Styling |
| Vite | Build tool |

## Components

### Header

- Logo and navigation
- Scroll effects
- Mobile menu

### Hero

- Animated entrance
- Call-to-action buttons
- Statistics

### Features

- Feature cards with icons
- Hover effects
- Responsive grid

### HowItWorks

- Step-by-step guide
- Visual indicators
- Animations

### Download

- Platform cards
- Download buttons
- Version information

### Footer

- Navigation links
- Copyright information
- Social links

## Deployment

The website is deployed to Cloudflare Pages.

**Build:**

\`\`\`bash
cd cloudplay-website
pnpm run build
\`\`\`

**Deploy:**

\`\`\`bash
wrangler pages deploy dist --project-name cloudplay-website
\`\`\`

## Custom Domain

Configure custom domain in Cloudflare Pages:
1. Add domain in Pages settings
2. Configure DNS records
3. Wait for SSL certificate
`,

  'architecture/security': `# Security

This document describes CloudPlay's security architecture.

## Token Security

### Token Lifecycle

1. **Request**: Client sends room ID to Worker
2. **Validation**: Worker validates room ID format
3. **Generation**: Worker calls Cloudflare API to generate token
4. **Return**: Token sent to client
5. **Storage**: Client stores token in OS keychain
6. **Usage**: Token used to establish tunnel
7. **Expiration**: Token expires after 1 hour

### Token Properties

| Property | Value |
|----------|-------|
| Lifetime | 1 hour |
| Binding | Specific hostname |
| Storage | OS keychain |
| Format | JWT |

## Rate Limiting

### Configuration

| Limit | Value | Window |
|-------|-------|--------|
| Requests per IP | 10 | 1 minute |

### Implementation

- Uses Cloudflare KV for counters
- Sliding window algorithm
- Automatic cleanup of expired entries

## Input Validation

### Room ID Validation

\`\`\`typescript
const roomIdRegex = /^[a-zA-Z0-9_-]{3,20}$/;
\`\`\`

**Rules:**
- Length: 3-20 characters
- Characters: alphanumeric, underscores, hyphens
- No spaces or special characters

## Network Security

### Encryption

- All traffic encrypted via HTTPS
- TLS 1.3 supported
- Certificate pinning (optional)

### CORS

Only allowed origins:
- \`https://cloudplay.lat\`
- \`https://www.cloudplay.lat\`
- \`tauri://localhost\`

## Application Security

### Source Code Protection

- Rust compiled to binary
- Difficult to reverse engineer
- No exposed JavaScript logic

### Secure Storage

- Tokens stored in OS keychain
- Not written to disk
- Protected by OS security

## Infrastructure Security

### Cloudflare Security

- DDoS protection
- WAF (Web Application Firewall)
- Bot management
- SSL/TLS encryption

### Worker Security

- Minimal permissions
- No persistent storage
- Sandboxed execution

## Security Best Practices

### For Users

1. Keep application updated
2. Use strong room IDs
3. Don't share tokens
4. Report vulnerabilities

### For Developers

1. Follow secure coding practices
2. Validate all inputs
3. Use parameterized queries
4. Keep dependencies updated

## Vulnerability Reporting

See our [Security Policy](https://github.com/cloudplay/cloudplay/blob/main/SECURITY.md) for reporting vulnerabilities.

## Compliance

- AGPL-3.0 license
- No data collection
- Privacy by design
`,

  'api/overview': `# API Overview

The CloudPlay API is a Cloudflare Worker that handles token issuance and rate limiting.

## Base URL

\`\`\`
Production: https://api.cloudplay.lat
Development: http://localhost:8787
\`\`\`

## Authentication

The API uses API tokens for authentication. Tokens are generated per session and have a 1-hour lifetime.

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| \`/api/token\` | POST | Generate tunnel token |
| \`/api/health\` | GET | Health check |

## Rate Limiting

| Limit | Value | Window |
|-------|-------|--------|
| Requests per IP | 10 | 1 minute |

## Response Format

All responses follow this format:

**Success:**

\`\`\`json
{
  "success": true,
  "data": { ... }
}
\`\`\`

**Error:**

\`\`\`json
{
  "success": false,
  "error": "Error message"
}
\`\`\`

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## CORS

The API supports CORS for:
- \`https://cloudplay.lat\`
- \`https://www.cloudplay.lat\`
- \`tauri://localhost\`

## SDKs

### JavaScript/TypeScript

\`\`\`typescript
import { CloudPlayClient } from '@cloudplay/sdk';

const client = new CloudPlayClient();
const { hostname, token } = await client.generateToken('myserver');
\`\`\`

### Rust

\`\`\`rust
use cloudplay_sdk::CloudPlayClient;

let client = CloudPlayClient::new("https://api.cloudplay.lat");
let token = client.generate_token("myserver").await?;
\`\`\`
`,

  'api/token': `# Token API

Generate a tunnel token for a specific room.

## Endpoint

\`\`\`
POST /api/token
\`\`\`

## Request

### Headers

| Header | Value | Required |
|--------|-------|----------|
| \`Content-Type\` | \`application/json\` | Yes |

### Body

\`\`\`json
{
  "roomId": "myserver"
}
\`\`\`

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| \`roomId\` | string | Yes | Room identifier (3-20 chars) |

### Validation Rules

- Length: 3-20 characters
- Characters: \`[a-zA-Z0-9_-]\`
- No spaces or special characters

## Response

### Success (200)

\`\`\`json
{
  "success": true,
  "data": {
    "hostname": "myserver.cloudplay.lat",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
\`\`\`

### Error (400)

\`\`\`json
{
  "success": false,
  "error": "Invalid room ID format"
}
\`\`\`

### Error (429)

\`\`\`json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later."
}
\`\`\`

## Examples

### cURL

\`\`\`bash
curl -X POST https://api.cloudplay.lat/api/token \\
  -H "Content-Type: application/json" \\
  -d '{"roomId": "myserver"}'
\`\`\`

### JavaScript

\`\`\`typescript
const response = await fetch('https://api.cloudplay.lat/api/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ roomId: 'myserver' }),
});

const data = await response.json();

if (data.success) {
  console.log('Hostname:', data.data.hostname);
  console.log('Token:', data.data.token);
}
\`\`\`

### Rust

\`\`\`rust
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

let client = Client::new();
let response = client
    .post("https://api.cloudplay.lat/api/token")
    .json(&TokenRequest { room_id: "myserver".to_string() })
    .send()
    .await?
    .json::<TokenResponse>()
    .await?;
\`\`\`
`,

  'api/health': `# Health Check

Check if the API is healthy.

## Endpoint

\`\`\`
GET /api/health
\`\`\`

## Request

No parameters required.

## Response

### Success (200)

\`\`\`json
{
  "status": "ok",
  "timestamp": "2026-07-13T12:00:00.000Z",
  "version": "1.0.0"
}
\`\`\`

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| \`status\` | string | Always \`"ok"\` for healthy service |
| \`timestamp\` | string | ISO 8601 timestamp |
| \`version\` | string | API version |

## Examples

### cURL

\`\`\`bash
curl https://api.cloudplay.lat/api/health
\`\`\`

### JavaScript

\`\`\`typescript
const response = await fetch('https://api.cloudplay.lat/api/health');
const data = await response.json();
console.log('Status:', data.status);
\`\`\`

## Use Cases

- **Monitoring**: Check if the API is available
- **Load Balancing**: Verify endpoint health
- **Debugging**: Confirm API is reachable
`,

  'api/rate-limiting': `# Rate Limiting

The API implements rate limiting to prevent abuse.

## Limits

| Limit | Value | Window |
|-------|-------|--------|
| Requests per IP | 10 | 1 minute |

## Response Headers

Rate limit information is included in response headers:

| Header | Description |
|--------|-------------|
| \`X-RateLimit-Limit\` | Maximum requests per window |
| \`X-RateLimit-Remaining\` | Remaining requests in window |
| \`X-RateLimit-Reset\` | Time when window resets (Unix timestamp) |
| \`Retry-After\` | Seconds to wait (only on 429 responses) |

## Rate Limit Exceeded

When rate limit is exceeded:

**Status Code:** \`429 Too Many Requests\`

**Response:**

\`\`\`json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later."
}
\`\`\`

## Implementation

Rate limiting uses Cloudflare KV with a sliding window algorithm:

1. Each IP has a counter in KV
2. Counter increments on each request
3. Counter expires after 1 minute
4. Requests blocked when counter exceeds limit

## Best Practices

1. **Implement backoff**: Wait before retrying
2. **Cache responses**: Reduce API calls
3. **Handle errors**: Show user-friendly messages
4. **Monitor usage**: Track rate limit hits
`,

  'api/errors': `# Error Handling

The API uses standard HTTP status codes and returns errors in a consistent format.

## Error Format

\`\`\`json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
\`\`\`

## Error Codes

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Bad Request | Invalid request body or parameters |
| 404 | Not Found | Endpoint does not exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

## Common Errors

### Invalid Room ID (400)

\`\`\`json
{
  "success": false,
  "error": "Invalid room ID format"
}
\`\`\`

**Cause:** Room ID doesn't meet validation rules.

**Solution:** Use 3-20 characters, letters/numbers/underscores/hyphens only.

### Rate Limit Exceeded (429)

\`\`\`json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later."
}
\`\`\`

**Cause:** Too many requests from your IP.

**Solution:** Wait 1 minute before retrying.

### Internal Server Error (500)

\`\`\`json
{
  "success": false,
  "error": "Failed to create tunnel token"
}
\`\`\`

**Cause:** Cloudflare API error or server issue.

**Solution:** Try again later or report the issue.

## Handling Errors

### JavaScript

\`\`\`typescript
try {
  const response = await fetch('https://api.cloudplay.lat/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId: 'myserver' }),
  });

  const data = await response.json();

  if (!data.success) {
    console.error('Error:', data.error);
    return;
  }

  // Success
  console.log('Token:', data.data.token);
} catch (error) {
  console.error('Network error:', error);
}
\`\`\`

### Rust

\`\`\`rust
match client.generate_token("myserver").await {
    Ok(token) => println!("Token: {}", token),
    Err(e) => eprintln!("Error: {}", e),
}
\`\`\`
`,

  'deployment/overview': `# Deployment Overview

This guide covers deploying CloudPlay to production.

## Components

| Component | Platform | Method |
|-----------|----------|--------|
| Backend Worker | Cloudflare Workers | Wrangler CLI |
| Website | Cloudflare Pages | Wrangler CLI |
| Desktop Client | Local build | Tauri CLI |

## Prerequisites

- Cloudflare account
- Domain name (optional)
- Node.js >= 18
- pnpm >= 8
- Rust >= 1.70 (for desktop client)
- Wrangler CLI

## Deployment Steps

### 1. Deploy Backend Worker

\`\`\`bash
cd cloudplay-backend
wrangler secret put CLOUDFLARE_API_TOKEN
pnpm run deploy
\`\`\`

### 2. Deploy Website

\`\`\`bash
cd cloudplay-website
pnpm run build
wrangler pages deploy dist --project-name cloudplay-website
\`\`\`

### 3. Build Desktop Client

\`\`\`bash
cd cloudplay-app
pnpm run tauri build
\`\`\`

## Configuration

See [Configuration](/guide/configuration) for details on configuring each component.

## Monitoring

- **Worker**: Cloudflare Dashboard > Workers > Analytics
- **Website**: Cloudflare Dashboard > Pages > Analytics
- **Client**: Application logs

## Rollback

### Worker Rollback

\`\`\`bash
wrangler deployments list
wrangler rollback [deployment-id]
\`\`\`

### Website Rollback

\`\`\`bash
wrangler pages deployment list --project-name cloudplay-website
wrangler pages deployment promote [deployment-id] --project-name cloudplay-website
\`\`\`
`,

  'deployment/worker': `# Worker Deployment

Deploy the backend Worker to Cloudflare.

## Prerequisites

1. Cloudflare account
2. API Token with Workers permissions
3. Tunnel UUID
4. KV Namespace

## Step 1: Create KV Namespace

\`\`\`bash
wrangler kv namespace create "KV_STORE"
\`\`\`

Copy the namespace ID.

## Step 2: Configure wrangler.toml

\`\`\`toml
name = "cloudplay-backend"
main = "src/index.ts"
compatibility_date = "2024-12-18"

[[kv_namespaces]]
binding = "KV_STORE"
id = "your_kv_namespace_id"

[vars]
ACCOUNT_ID = "your_cloudflare_account_id"
TUNNEL_ID = "your_tunnel_uuid"
\`\`\`

## Step 3: Set Secrets

\`\`\`bash
cd cloudplay-backend
wrangler secret put CLOUDFLARE_API_TOKEN
\`\`\`

Enter your API token when prompted.

## Step 4: Deploy

\`\`\`bash
pnpm install
pnpm run deploy
\`\`\`

## Step 5: Verify

\`\`\`bash
# Health check
curl https://cloudplay-backend.YOUR_SUBDOMAIN.workers.dev/api/health

# Test token generation
curl -X POST https://cloudplay-backend.YOUR_SUBDOMAIN.workers.dev/api/token \\
  -H "Content-Type: application/json" \\
  -d '{"roomId": "test123"}'
\`\`\`

## Custom Domain

To use a custom domain:

1. Add route in wrangler.toml:

\`\`\`toml
routes = [
  { pattern = "api.cloudplay.lat/*", zone_name = "cloudplay.lat" }
]
\`\`\`

2. Configure DNS in Cloudflare
3. Redeploy

## Monitoring

View analytics in Cloudflare Dashboard:
- Workers & Pages > Your Worker > Analytics

## Logs

View real-time logs:

\`\`\`bash
wrangler tail
\`\`\`

## Rollback

\`\`\`bash
wrangler deployments list
wrangler rollback [deployment-id]
\`\`\`
`,

  'deployment/website': `# Website Deployment

Deploy the website to Cloudflare Pages.

## Build

\`\`\`bash
cd cloudplay-website
pnpm install
pnpm run build
\`\`\`

## Deploy

### Create Pages Project

\`\`\`bash
wrangler pages project create cloudplay-website --production-branch main
\`\`\`

### Deploy

\`\`\`bash
wrangler pages deploy dist --project-name cloudplay-website
\`\`\`

## Custom Domain

### Add Domain

1. Go to Cloudflare Dashboard > Pages
2. Select your project
3. Go to "Custom domains"
4. Add your domain (e.g., \`cloudplay.lat\`)

### Configure DNS

Add CNAME record:

| Type | Name | Target |
|------|------|--------|
| CNAME | \`@\` | \`cloudplay-website.pages.dev\` |
| CNAME | \`www\` | \`cloudplay-website.pages.dev\` |

## Environment Variables

Set environment variables in Pages dashboard:

1. Go to Settings > Environment variables
2. Add variables as needed

## Preview Deployments

Each push to a non-production branch creates a preview deployment:

\`\`\`bash
git push origin feature/my-feature
\`\`\`

Preview URL: \`https://feature-my-feature.cloudplay-website.pages.dev\`

## Rollback

\`\`\`bash
wrangler pages deployment list --project-name cloudplay-website
wrangler pages deployment promote [deployment-id] --project-name cloudplay-website
\`\`\`
`,

  'deployment/desktop': `# Desktop App Deployment

Build the desktop application for distribution.

## Windows

### Prerequisites

- Visual Studio 2022 Build Tools
- Windows 10/11 SDK

### Build

\`\`\`bash
cd cloudplay-app
pnpm install
pnpm run tauri build
\`\`\`

### Create MSI

\`\`\`bash
cd src-tauri
cargo wix
\`\`\`

### Code Signing

\`\`\`bash
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com \\
  src-tauri/target/release/cloudplay-app.exe
\`\`\`

## macOS

### Prerequisites

- Xcode Command Line Tools
- Apple Developer ID

### Build

\`\`\`bash
cd cloudplay-app
pnpm install
pnpm run tauri build
\`\`\`

### Code Signing

\`\`\`bash
codesign --force --deep --sign "Developer ID Application: Your Name (TEAM_ID)" \\
  src-tauri/target/release/bundle/macos/CloudPlay.app
\`\`\`

### Notarization

\`\`\`bash
xcrun notarytool submit CloudPlay.dmg \\
  --apple-id your@apple.id \\
  --team-id TEAM_ID

xcrun stapler staple CloudPlay.dmg
\`\`\`

## Linux

### Prerequisites

\`\`\`bash
sudo apt install libdbus-1-dev libwebkit2gtk-4.1-dev libgtk-3-dev
\`\`\`

### Build

\`\`\`bash
cd cloudplay-app
pnpm install
pnpm run tauri build
\`\`\`

### Output

- \`.deb\` package
- \`.AppImage\`

## Distribution

### GitHub Releases

1. Create a new release
2. Upload build artifacts
3. Publish release

### Auto-Update

Configure in \`tauri.conf.json\`:

\`\`\`json
{
  "plugins": {
    "updater": {
      "pubkey": "your-public-key",
      "endpoints": ["https://cloudplay.lat/updates.json"]
    }
  }
}
\`\`\`
`,

  'deployment/dns': `# DNS Setup

Configure DNS for CloudPlay.

## Wildcard DNS

Add a CNAME record for wildcard subdomains:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | \`*\` | \`<tunnel-uuid>.cfargotunnel.com\` | Proxied |

This ensures all subdomains (\`*.cloudplay.lat\`) are routed to the tunnel.

## Main Domain

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | \`@\` | \`cloudplay-website.pages.dev\` | Proxied |
| CNAME | \`www\` | \`cloudplay-website.pages.dev\` | Proxied |

## API Domain

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | \`api\` | \`cloudplay-backend.<subdomain>.workers.dev\` | Proxied |

## SSL/TLS

Cloudflare automatically provisions SSL certificates:

1. **Universal SSL**: Free, shared certificate
2. **Advanced Certificate Manager**: Custom certificates
3. **SSL for SaaS**: Per-hostname certificates

## DNSSEC

Enable DNSSEC for additional security:

1. Go to Cloudflare Dashboard > DNS
2. Enable DNSSEC
3. Add DS record at your registrar

## Verification

\`\`\`bash
# Check DNS resolution
nslookup cloudplay.lat
nslookup api.cloudplay.lat
nslookup myserver.cloudplay.lat

# Check SSL
curl -vI https://cloudplay.lat
\`\`\`
`,

  'development/setup': `# Development Setup

Set up the development environment for CloudPlay.

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | >= 18 | JavaScript runtime |
| pnpm | >= 8 | Package manager |
| Rust | >= 1.70 | Desktop client backend |
| Git | Latest | Version control |
| Wrangler | Latest | Cloudflare CLI |

### Optional Software

| Software | Purpose |
|----------|---------|
| VS Code | Recommended IDE |
| Docker | Containerized development |

## Clone Repository

\`\`\`bash
git clone https://github.com/cloudplay/cloudplay.git
cd cloudplay
\`\`\`

## Install Dependencies

\`\`\`bash
# Install all dependencies
pnpm install

# Or install per project
cd cloudplay-backend && pnpm install
cd ../cloudplay-app && pnpm install
cd ../cloudplay-website && pnpm install
\`\`\`

## Configure Environment

### Backend Worker

\`\`\`bash
cd cloudplay-backend
cp .dev.vars.example .dev.vars
\`\`\`

Edit \`.dev.vars\` with your values:

\`\`\`
ACCOUNT_ID=your_account_id
TUNNEL_ID=your_tunnel_id
CLOUDFLARE_API_TOKEN=your_api_token
\`\`\`

## Start Development Servers

### Option A: Start All

\`\`\`bash
pnpm run dev:all
\`\`\`

### Option B: Start Individually

**Terminal 1 - Backend:**

\`\`\`bash
cd cloudplay-backend
pnpm run dev
\`\`\`

**Terminal 2 - Client:**

\`\`\`bash
cd cloudplay-app
pnpm run tauri dev
\`\`\`

**Terminal 3 - Website:**

\`\`\`bash
cd cloudplay-website
pnpm run dev
\`\`\`

## IDE Setup

### VS Code

Install recommended extensions:

- Volar (Vue support)
- Tauri (Tauri support)
- rust-analyzer (Rust support)
- ESLint (JavaScript linting)
- Prettier (Code formatting)

## Next Steps

- Read [Architecture](/development/architecture) to understand the codebase
- Check [Testing](/development/testing) for running tests
- See [Contributing](/development/contributing) for contribution guidelines
`,

  'development/architecture': `# Development Architecture

Understanding the codebase structure.

## Project Structure

\`\`\`
cloudplay/
├── cloudplay-backend/      # Cloudflare Worker
│   ├── src/
│   │   ├── index.ts        # Main entry
│   │   └── middleware/     # Rate limiter
│   ├── wrangler.toml
│   └── package.json
│
├── cloudplay-app/          # Tauri Desktop Client
│   ├── src-tauri/          # Rust Backend
│   │   ├── src/
│   │   │   ├── main.rs
│   │   │   ├── lib.rs
│   │   │   ├── commands/
│   │   │   ├── services/
│   │   │   └── models/
│   │   └── Cargo.toml
│   ├── src/                # React Frontend
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   └── package.json
│
├── cloudplay-website/      # Vue.js Website
│   ├── src/
│   │   ├── components/
│   │   └── App.vue
│   └── package.json
│
└── docs/                   # Documentation
\`\`\`

## Backend Worker

### Entry Point

\`src/index.ts\` - Main Hono application with routes.

### Middleware

\`src/middleware/rate-limiter.ts\` - IP-based rate limiting.

## Desktop Client

### Rust Backend

**Commands** (\`src-tauri/src/commands/\`):
- \`tunnel.rs\` - Tunnel management commands
- \`port.rs\` - Port detection commands

**Services** (\`src-tauri/src/services/\`):
- \`cloudflared.rs\` - Process management
- \`api_client.rs\` - Worker API client
- \`credential.rs\` - Secure storage
- \`port_scanner.rs\` - Port scanning

**Models** (\`src-tauri/src/models/\`):
- Data structures and types

### React Frontend

**Components** (\`src/components/\`):
- Reusable UI components

**Pages** (\`src/pages/\`):
- HostPage - Host mode
- ClientPage - Client mode

**Services** (\`src/services/\`):
- API calls
- Tauri IPC

**Store** (\`src/store/\`):
- Zustand state management

## Data Flow

### Host Mode

1. User enters room ID in React UI
2. UI calls Tauri command
3. Rust calls Worker API for token
4. Rust starts cloudflared with token
5. Tunnel established
6. UI shows shareable address

### Client Mode

1. User enters host address in React UI
2. UI calls Tauri command
3. Rust starts cloudflared access
4. Connection established
5. UI shows localhost address
`,

  'development/testing': `# Testing

This guide covers testing CloudPlay.

## Unit Tests

### Backend Worker

\`\`\`bash
cd cloudplay-backend
pnpm run test
\`\`\`

### Desktop Client

\`\`\`bash
cd cloudplay-app
cargo test
\`\`\`

### Website

\`\`\`bash
cd cloudplay-website
pnpm run test
\`\`\`

## Integration Tests

\`\`\`bash
pnpm run test:integration
\`\`\`

## End-to-End Tests

\`\`\`bash
pnpm run test:e2e
\`\`\`

## Test Coverage

\`\`\`bash
pnpm run test:coverage
\`\`\`

## Writing Tests

### Backend Test Example

\`\`\`typescript
import { describe, it, expect } from 'vitest';

describe('Token API', () => {
  it('should generate token for valid room ID', async () => {
    const response = await app.request('/api/token', {
      method: 'POST',
      body: JSON.stringify({ roomId: 'test123' }),
    });

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.hostname).toBe('test123.cloudplay.lat');
  });

  it('should reject invalid room ID', async () => {
    const response = await app.request('/api/token', {
      method: 'POST',
      body: JSON.stringify({ roomId: 'ab' }),
    });

    const data = await response.json();
    expect(data.success).toBe(false);
  });
});
\`\`\`

### Rust Test Example

\`\`\`rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_port_available() {
        assert!(is_port_available(12345));
    }

    #[tokio::test]
    async fn test_tunnel_manager() {
        let manager = TunnelManager::new();
        assert!(!manager.is_running().await);
    }
}
\`\`\`

## Continuous Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Nightly builds

See \`.github/workflows/ci.yml\` for configuration.
`,

  'development/contributing': `# Contributing

We welcome contributions to CloudPlay!

## Ways to Contribute

- **Report Bugs**: Use the bug report template
- **Suggest Features**: Use the feature request template
- **Improve Documentation**: Submit documentation PRs
- **Write Code**: Submit code PRs

## Development Workflow

### 1. Fork and Clone

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/cloudplay.git
cd cloudplay
git remote add upstream https://github.com/cloudplay/cloudplay.git
\`\`\`

### 2. Create Branch

\`\`\`bash
git checkout -b feature/your-feature
\`\`\`

### 3. Make Changes

- Follow code conventions
- Write tests
- Update documentation

### 4. Test

\`\`\`bash
pnpm run test
pnpm run lint
\`\`\`

### 5. Commit

\`\`\`bash
git commit -m "feat: add your feature"
\`\`\`

Use [Conventional Commits](https://www.conventionalcommits.org/):
- \`feat:\` New feature
- \`fix:\` Bug fix
- \`docs:\` Documentation
- \`style:\` Code style
- \`refactor:\` Refactoring
- \`test:\` Tests
- \`chore:\` Other

### 6. Push and PR

\`\`\`bash
git push origin feature/your-feature
\`\`\`

Create a Pull Request on GitHub.

## Code Style

### TypeScript/JavaScript

- Use ESLint
- Use Prettier
- Use TypeScript strict mode

### Rust

- Use rustfmt
- Use clippy

### Vue/React

- Use Composition API (Vue)
- Use Hooks (React)

## Pull Request Guidelines

1. Fill out the PR template
2. Link related issues
3. Include screenshots for UI changes
4. Ensure all tests pass
5. Request review from maintainers

## License

By contributing, you agree that your contributions will be licensed under AGPL-3.0.
`,

  'legal/privacy': `# Privacy Policy

**Effective Date:** July 14, 2026
**Last Updated:** July 14, 2026

CloudPlay ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our desktop application, website, and related services (collectively, the "Service").

---

## 1. Information We Collect

### 1.1 Information You Provide

- **Room IDs**: When you create or join a gaming session, you provide a room identifier. Room IDs are generated client-side and are not stored on our servers beyond the duration of the active session.
- **Server Addresses**: When connecting as a client, you provide a server address. This information is processed locally and is not retained after the session ends.

### 1.2 Information Collected Automatically

- **API Request Logs**: Our backend (Cloudflare Workers) may temporarily log request metadata (IP address, timestamp, request path) for operational purposes. These logs are automatically purged within 72 hours.
- **Health Check Data**: Periodic health check pings to our API contain no personal information and are used solely to monitor service availability.

### 1.3 Information We Do NOT Collect

We explicitly do **not** collect:

- Personal identifying information (name, email, phone number)
- Payment or financial information
- Browsing history or cookies for tracking purposes
- Device fingerprints or advertising identifiers
- Game save data, screenshots, or any game content
- Keystrokes, clipboard content, or screen recordings

---

## 2. How We Use Information

We use the limited information we collect solely for the following purposes:

| Purpose | Data Used |
|---------|-----------|
| Providing the tunnel service | Room ID, API token |
| Maintaining service reliability | Aggregated, anonymized API metrics |
| Preventing abuse | IP-based rate limiting (temporary) |

We do **not** use your data for advertising, profiling, analytics, or any purpose beyond providing the core Service.

---

## 3. Data Storage and Retention

- **Session Data**: All session data (room IDs, tunnel configurations) is ephemeral and exists only during the active session. Once a session ends, all associated data is immediately discarded.
- **API Tokens**: Cloudflare tunnel tokens are stored locally on your device using the operating system's secure keychain (Windows Credential Manager, macOS Keychain, or Linux Secret Service). Tokens are never transmitted to or stored on our servers.
- **No Persistent Storage**: We maintain no databases, user accounts, or persistent storage of any user data.

---

## 4. Third-Party Services

### 4.1 Cloudflare

Our Service relies on Cloudflare's infrastructure for:

- **Cloudflare Tunnels**: To establish secure connections between users
- **Cloudflare Workers**: To run our API backend at the edge
- **Cloudflare DNS**: For wildcard domain resolution (\`*.cloudplay.lat\`)

Cloudflare's handling of data is governed by [Cloudflare's Privacy Policy](https://www.cloudflare.com/privacypolicy/).

### 4.2 No Other Third Parties

We do not share data with any third parties beyond Cloudflare's infrastructure, which is integral to the operation of the Service.

---

## 5. MSIX Packaging and Windows Capabilities

### 5.1 About Our Windows Application

The CloudPlay desktop application for Windows is built using [Tauri v2](https://v2.tauri.app/), which produces a traditional Win32 executable (\`.exe\`). To distribute the application through the Microsoft Store and provide a modern installation experience, we package this executable using the **MSIX Packaging Tool**.

### 5.2 The runFullTrust Capability

Our MSIX package declares the \`runFullTrust\` capability. This is a **restricted capability** required because the underlying application is a traditional Win32 program that may exercise the following system operations:

| Capability | Purpose |
|------------|---------|
| File system access | Reading/writing game configuration and log files |
| Network access | Establishing Cloudflare tunnel connections |
| Process management | Managing the tunnel subprocess |
| Windows Credential Manager | Securely storing API tokens via the \`keyring\` crate |

The \`runFullTrust\` declaration is a **technical requirement** of packaging a Win32 application as MSIX — it does not grant the application any additional privileges beyond what a standard \`.exe\` installer would have. The application runs in the same security context as any traditionally installed desktop program.

### 5.3 What This Means for You

- The application **does not** request administrator privileges
- The application **does not** modify system files or registry keys outside its own installation directory
- The application **does not** install background services or startup items
- All network activity is limited to the Cloudflare tunnel endpoints required for the Service to function

---

## 6. Data Security

We implement appropriate technical measures to protect the limited data we process:

- **Encryption in Transit**: All API communications use HTTPS/TLS 1.3
- **Encryption at Rest**: API tokens are stored using OS-native secure storage
- **No Server-Side Storage**: The absence of persistent user data eliminates the risk of data breaches
- **Rate Limiting**: API endpoints are protected by Cloudflare Workers rate limiting to prevent abuse

---

## 7. Children's Privacy

The Service is not directed to children under the age of 13 (or the applicable age of digital consent in your jurisdiction). We do not knowingly collect information from children. If you believe a child has provided us with personal information, please contact us so we can take appropriate action.

---

## 8. International Data Transfers

The Service operates on Cloudflare's global edge network. API requests are processed at the nearest Cloudflare data center to your location. As Cloudflare operates in over 300 cities worldwide, your data may be processed in a country different from your own. Cloudflare's data processing practices are governed by their [Privacy Policy](https://www.cloudflare.com/privacypolicy/) and are compliant with applicable data protection regulations.

---

## 9. Your Rights

Depending on your jurisdiction, you may have the following rights:

- **Right to Access**: You may request information about what data we hold (which, given our architecture, will be minimal or none)
- **Right to Deletion**: Since we do not persist user data, there is typically nothing to delete
- **Right to Object**: You may stop using the Service at any time
- **Right to Data Portability**: Not applicable as we do not maintain user profiles

To exercise any of these rights, please contact us at the address below.

---

## 10. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify users of material changes by:

- Updating the "Last Updated" date at the top of this page
- Publishing changes on our documentation site

Your continued use of the Service after changes constitutes acceptance of the updated policy.

---

## 11. Open Source Transparency

CloudPlay is open-source software licensed under AGPL-3.0. You can verify our privacy practices by reviewing the source code:

- [GitHub Repository](https://github.com/LemonStudio-hub/cloudplay)

We believe in transparency and welcome community audit of our data handling practices.

---

## 12. Contact Us

If you have questions about this Privacy Policy or our data practices, please contact us:

- **Email**: team@cloudplay.lat
- **GitHub Issues**: [github.com/LemonStudio-hub/cloudplay/issues](https://github.com/LemonStudio-hub/cloudplay/issues)
`,
}
