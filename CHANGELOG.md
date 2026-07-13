# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nothing yet

### Changed
- Nothing yet

### Deprecated
- Nothing yet

### Removed
- Nothing yet

### Fixed
- Nothing yet

### Security
- Nothing yet

## [1.0.0] - 2026-07-13

### Added

#### Backend (Cloudflare Worker)
- Token issuance API with Hono framework
- Rate limiting middleware using Cloudflare KV
- Health check endpoint
- CORS configuration for production domains
- Input validation for room IDs

#### Desktop Client (Tauri)
- Cross-platform support (Windows, macOS, Linux)
- Tunnel manager for cloudflared process management
- Secure token storage using OS keychain
- Port scanner for automatic port detection
- Host mode with one-click tunnel creation
- Client mode with one-click connection
- Real-time tunnel status display
- Log streaming from cloudflared process

#### Website (Vue.js)
- Modern, responsive landing page
- Hero section with animated entrance
- Features showcase with hover effects
- How it works section with step-by-step guide
- Multi-platform download section
- Footer with navigation links

#### Infrastructure
- Cloudflare Pages deployment for website
- Cloudflare Workers deployment for backend
- GitHub Actions CI/CD pipeline
- Automated release workflow

#### Documentation
- Comprehensive README with architecture overview
- API documentation
- Contributing guidelines
- Code of conduct
- Security policy
- Platform-specific build guides

### Changed
- Nothing (initial release)

### Deprecated
- Nothing (initial release)

### Removed
- Nothing (initial release)

### Fixed
- Nothing (initial release)

### Security
- Token expiration set to 1 hour
- Rate limiting: 10 requests per minute per IP
- Input sanitization for room IDs
- Secure token storage in OS keychain

## [0.1.0] - 2026-07-12

### Added
- Initial project scaffolding
- Basic project structure
- Development environment setup

---

## Release Notes

### v1.0.0 - Initial Release

 **CloudPlay v1.0.0 is here!**

This is the first official release of CloudPlay, a free and open-source remote play platform for LAN games.

#### Highlights

- **One-Click Hosting**: Create a tunnel with a single click and share the address with friends
- **Zero Configuration**: No port forwarding, no VPN, no public IP required
- **Global Network**: Powered by Cloudflare's global edge network for low-latency connections
- **Secure**: End-to-end encryption with tokens stored in OS keychain
- **Lightweight**: < 20MB installer, minimal memory usage
- **Cross-Platform**: Works on Windows, macOS, and Linux

#### Known Issues

- Code signing certificates not yet obtained (Windows SmartScreen warning)
- macOS notarization pending
- Auto-update feature not yet implemented

#### Upgrade Notes

This is the initial release, no upgrade path needed.

---

## Links

- [GitHub Releases](https://github.com/cloudplay/cloudplay/releases)
- [Documentation](https://cloudplay.app/docs)
- [Changelog](https://github.com/cloudplay/cloudplay/blob/main/CHANGELOG.md)
