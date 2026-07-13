# Deployment Guide

This guide covers deploying CloudPlay to production.

## Prerequisites

- Cloudflare account
- Domain name (optional, but recommended)
- Node.js >= 18
- pnpm >= 8
- Rust >= 1.70 (for building desktop client)
- Wrangler CLI

## 1. Backend Worker Deployment

### Step 1: Configure Cloudflare

1. **Get Account ID**
   - Go to Cloudflare Dashboard
   - Copy your Account ID from the sidebar

2. **Create API Token**
   - Go to "My Profile" → "API Tokens"
   - Create a token with permissions:
     - Account > Cloudflare Workers > Edit
     - Account > Workers KV Storage > Edit

3. **Create Tunnel**
   - Go to Zero Trust Dashboard
   - Networks → Tunnels → Create a tunnel
   - Copy the Tunnel UUID

4. **Create KV Namespace**
   ```bash
   wrangler kv namespace create "KV_STORE"
   ```

### Step 2: Configure Worker

Edit `cloudplay-backend/wrangler.toml`:

```toml
name = "cloudplay-backend"
main = "src/index.ts"
compatibility_date = "2024-12-18"

[[kv_namespaces]]
binding = "KV_STORE"
id = "your_kv_namespace_id"

[vars]
ACCOUNT_ID = "your_cloudflare_account_id"
TUNNEL_ID = "your_tunnel_uuid"
```

### Step 3: Set Secrets

```bash
cd cloudplay-backend

# Set Cloudflare API Token
wrangler secret put CLOUDFLARE_API_TOKEN
# Enter your API token when prompted
```

### Step 4: Deploy

```bash
cd cloudplay-backend
pnpm install
pnpm run deploy
```

### Step 5: Verify

```bash
# Health check
curl https://cloudplay-backend.YOUR_SUBDOMAIN.workers.dev/api/health

# Test token generation
curl -X POST https://cloudplay-backend.YOUR_SUBDOMAIN.workers.dev/api/token \
  -H "Content-Type: application/json" \
  -d '{"roomId": "test123"}'
```

---

## 2. Website Deployment

### Option A: Cloudflare Pages (Recommended)

#### Step 1: Build

```bash
cd cloudplay-website
pnpm install
pnpm run build
```

#### Step 2: Deploy

```bash
# Create Pages project
wrangler pages project create cloudplay-website --production-branch main

# Deploy
wrangler pages deploy dist --project-name cloudplay-website
```

#### Step 3: Custom Domain (Optional)

1. Go to Cloudflare Dashboard → Pages
2. Select your project
3. Go to "Custom domains"
4. Add your domain (e.g., `cloudplay.app`)
5. Configure DNS as instructed

### Option B: GitHub Pages

1. Push code to GitHub
2. Go to repository Settings → Pages
3. Select source branch
4. Configure custom domain (optional)

---

## 3. Desktop Client Build

### Windows

#### Prerequisites

- Visual Studio 2022 Build Tools
- Windows 10/11 SDK

#### Build

```bash
cd cloudplay-app
pnpm install
pnpm run tauri build
```

#### Create MSI Installer

```bash
cd src-tauri
cargo wix
```

Output: `src-tauri/target/x86_64-pc-windows-msvc/release/wix/cloudplay-app-1.0.0-x86_64.msi`

#### Code Signing (Optional)

```bash
# Sign the executable
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com src-tauri/target/release/cloudplay-app.exe

# Sign the MSI
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com src-tauri/target/release/wix/cloudplay-app-1.0.0-x86_64.msi
```

### macOS

#### Prerequisites

- Xcode Command Line Tools
- Apple Developer ID (for signing)

#### Build

```bash
cd cloudplay-app
pnpm install
pnpm run tauri build
```

Output: `src-tauri/target/release/bundle/macos/CloudPlay.app`

#### Code Signing

```bash
# Sign the app
codesign --force --deep --sign "Developer ID Application: Your Name (TEAM_ID)" \
  src-tauri/target/release/bundle/macos/CloudPlay.app

# Create DMG
hdiutil create -volname "CloudPlay" -srcfolder src-tauri/target/release/bundle/macos/CloudPlay.app -ov -format UDZO CloudPlay.dmg

# Sign the DMG
codesign --sign "Developer ID Application: Your Name (TEAM_ID)" CloudPlay.dmg
```

#### Notarization

```bash
# Submit for notarization
xcrun notarytool submit CloudPlay.dmg \
  --apple-id your@apple.id \
  --team-id TEAM_ID \
  --password your-app-specific-password

# Staple the notarization
xcrun stapler staple CloudPlay.dmg
```

### Linux

#### Prerequisites

- System dependencies:
  ```bash
  sudo apt install libdbus-1-dev libwebkit2gtk-4.1-dev libgtk-3-dev \
    libayatana-appindicator3-dev librsvg2-dev pkg-config
  ```

#### Build

```bash
cd cloudplay-app
pnpm install
pnpm run tauri build
```

Output:
- `.deb` package: `src-tauri/target/release/bundle/deb/cloudplay-app_1.0.0_amd64.deb`
- `.AppImage`: `src-tauri/target/release/bundle/appimage/cloudplay-app_1.0.0_amd64.AppImage`

---

## 4. DNS Configuration

### Wildcard DNS

Add a CNAME record for wildcard subdomains:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `*` | `<tunnel-uuid>.cfargotunnel.com` | Proxied |

### Main Domain

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `@` | `cloudplay-website.pages.dev` | Proxied |
| CNAME | `www` | `cloudplay-website.pages.dev` | Proxied |
| CNAME | `api` | `cloudplay-backend.<subdomain>.workers.dev` | Proxied |

---

## 5. Environment Variables Summary

### Worker Environment

| Variable | Description | Source |
|----------|-------------|--------|
| `ACCOUNT_ID` | Cloudflare Account ID | wrangler.toml |
| `TUNNEL_ID` | Tunnel UUID | wrangler.toml |
| `CLOUDFLARE_API_TOKEN` | API Token | Secret |
| `KV_STORE` | KV Namespace | wrangler.toml |

### Client Environment

| Variable | Description | Location |
|----------|-------------|----------|
| API Base URL | Worker API endpoint | src-tauri/src/lib.rs |

---

## 6. Monitoring

### Cloudflare Analytics

1. Go to Cloudflare Dashboard
2. Workers & Pages → Your Worker
3. View Analytics tab

### Custom Monitoring

Add custom logging in your Worker:

```typescript
console.log('Token requested:', {
  roomId,
  ip: c.req.header('CF-Connecting-IP'),
  timestamp: new Date().toISOString(),
});
```

### Alerts

Configure alerts in Cloudflare Dashboard:

1. Go to Notifications
2. Create alert rules for:
   - HTTP 5xx errors > threshold
   - Request rate > threshold
   - Error rate > threshold

---

## 7. Rollback

### Worker Rollback

```bash
# List deployments
wrangler deployments list

# Rollback to specific version
wrangler rollback [deployment-id]
```

### Website Rollback

```bash
# List deployments
wrangler pages deployment list --project-name cloudplay-website

# Rollback (promote previous deployment)
wrangler pages deployment promote [deployment-id] --project-name cloudplay-website
```

---

## 8. Troubleshooting

### Common Issues

#### Worker deployment fails

```bash
# Check Wrangler version
wrangler --version

# Login again
wrangler login

# Verify configuration
wrangler deploy --dry-run
```

#### Tunnel not working

1. Verify Tunnel UUID in wrangler.toml
2. Check Tunnel status in Zero Trust Dashboard
3. Verify DNS configuration
4. Check cloudflared logs

#### Website not updating

1. Clear browser cache
2. Check deployment status
3. Verify build output
4. Check Cloudflare Pages logs

---

## 9. Security Checklist

- [ ] API Token has minimal permissions
- [ ] Secrets are stored via `wrangler secret`
- [ ] Rate limiting is enabled
- [ ] Input validation is in place
- [ ] HTTPS is enforced
- [ ] CORS is configured correctly
- [ ] Code signing certificates are valid
- [ ] Dependencies are up to date

---

## 10. Maintenance

### Regular Tasks

1. **Weekly**
   - Check error logs
   - Monitor rate limit hits
   - Review security advisories

2. **Monthly**
   - Update dependencies
   - Review API usage
   - Check certificate expiration

3. **Quarterly**
   - Security audit
   - Performance review
   - Cost analysis
