# Frequently Asked Questions (FAQ)

## General

### What is CloudPlay?

CloudPlay（云玩）是一个开源的远程联机服务平台，专为局域网游戏设计。它基于 Cloudflare 全球网络，提供零配置、低延迟的远程联机体验。

### Is CloudPlay free?

Yes! CloudPlay is completely free to use. It leverages Cloudflare's free tier, which provides generous limits for most use cases.

### What games does CloudPlay support?

CloudPlay supports any game that uses LAN multiplayer, including but not limited to:

- Minecraft (Java Edition)
- Terraria
- Factorio
- Stardew Valley
- Don't Starve Together
- And many more!

### Is CloudPlay open source?

Yes! CloudPlay is open source under the [GNU Affero General Public License v3.0](LICENSE). You can view the source code on [GitHub](https://github.com/cloudplay/cloudplay).

### What platforms does CloudPlay support?

CloudPlay supports:

- Windows 10/11
- macOS 12+
- Linux (Ubuntu 20.04+, Debian 11+, Fedora 35+, etc.)

## Installation

### How do I install CloudPlay?

1. Download the installer for your platform from [cloudplay.app](https://cloudplay.app)
2. Run the installer
3. Follow the on-screen instructions

### Windows says the app is unsafe. What should I do?

This is a SmartScreen warning because the app is not yet code-signed. To proceed:

1. Click "More info"
2. Click "Run anyway"

We're working on obtaining a code signing certificate.

### macOS says the app is from an unidentified developer. What should I do?

This is because the app is not yet notarized. To proceed:

1. Right-click the app and select "Open"
2. Click "Open" in the dialog

We're working on Apple notarization.

### How do I update CloudPlay?

CloudPlay will automatically check for updates. You can also:

1. Download the latest version from [cloudplay.app](https://cloudplay.app)
2. Install over the existing installation

## Usage

### How do I host a game?

1. Open CloudPlay
2. Select "Host" mode
3. Enter a room ID (e.g., "myserver")
4. Set your local game port (default: 25565)
5. Click "Start Tunnel"
6. Share the generated address with friends

### How do I join a game?

1. Open CloudPlay
2. Select "Client" mode
3. Enter the host's address (e.g., "myserver.cloudplay.app")
4. Set a local port (default: 25566)
5. Click "Connect"
6. In your game, connect to `localhost:<port>`

### What is the room ID?

The room ID is a unique identifier for your game session. It becomes part of your address (e.g., `myserver.cloudplay.app`).

**Rules:**
- 3-20 characters
- Letters, numbers, underscores, hyphens only
- No spaces or special characters

### What port should I use?

- **Host**: Use the port your game server runs on (default: 25565 for Minecraft)
- **Client**: Use a different port (default: 25566) to avoid conflicts

### Why can't I connect?

Common reasons:

1. **Wrong address**: Double-check the host's address
2. **Firewall**: Check if your firewall is blocking the connection
3. **Game not running**: Make sure the game server is running
4. **Port conflict**: Try a different local port

### Why is my connection slow?

CloudPlay uses Cloudflare's global network, which should provide low latency. If you experience slowness:

1. **Check your internet**: Run a speed test
2. **Try a different room ID**: Some IDs may route through different servers
3. **Check game settings**: Some games have bandwidth-intensive settings

## Technical

### How does CloudPlay work?

CloudPlay uses Cloudflare Tunnel to create a secure tunnel between players:

1. **Host** creates a tunnel with a unique address
2. **Cloudflare** routes traffic through its global network
3. **Client** connects to the tunnel address
4. Traffic flows directly between players

### Is my data secure?

Yes! CloudPlay uses:

- **HTTPS encryption**: All traffic is encrypted in transit
- **Token security**: Tokens are stored in OS keychain
- **Short-lived tokens**: Tokens expire after 1 hour
- **Rate limiting**: Protection against abuse

### What is Cloudflare Tunnel?

Cloudflare Tunnel creates a secure tunnel between your device and Cloudflare's network. It allows others to connect to your device without exposing your IP address.

### Do I need to open ports on my router?

No! CloudPlay uses Cloudflare Tunnel, which doesn't require any port forwarding.

### Do I need a public IP?

No! CloudPlay works behind NAT and firewalls.

### What are the system requirements?

**Minimum:**
- Windows 10, macOS 12, or Linux (Ubuntu 20.04+)
- 2GB RAM
- 100MB disk space
- Internet connection

**Recommended:**
- Windows 11, macOS 14, or recent Linux
- 4GB RAM
- 500MB disk space
- Broadband internet

### How much bandwidth does CloudPlay use?

Bandwidth usage depends on the game. Typical usage:

- **Minecraft**: ~1-5 MB/s
- **Terraria**: ~0.5-2 MB/s
- **Factorio**: ~0.1-1 MB/s

## Troubleshooting

### The app won't start

1. **Check system requirements**
2. **Update your OS**
3. **Reinstall the app**
4. **Check antivirus**: Add CloudPlay to exceptions

### "Failed to spawn cloudflared"

This means the `cloudflared` binary couldn't be found or executed.

1. **Reinstall the app**: The binary should be bundled
2. **Check antivirus**: It may be blocking the binary
3. **Manual install**: Download `cloudflared` from [Cloudflare](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)

### "Port already in use"

Another application is using the port.

1. **Change the port**: Use a different port number
2. **Find the conflict**: Use `netstat` or `lsof` to find what's using the port
3. **Close the application**: Stop the application using the port

### "Rate limit exceeded"

You've made too many requests.

1. **Wait**: Rate limits reset after 1 minute
2. **Reduce requests**: Don't spam the connect button
3. **Check for bugs**: If this happens repeatedly, report it

### "Invalid room ID"

The room ID doesn't meet the requirements.

1. **Check length**: Must be 3-20 characters
2. **Check characters**: Only letters, numbers, underscores, hyphens
3. **No spaces**: Remove any spaces

### Tunnel disconnects frequently

1. **Check internet stability**
2. **Disable VPN**: VPNs can interfere with tunnels
3. **Check firewall**: Ensure CloudPlay is allowed
4. **Try wired connection**: WiFi can be unstable

## Account & Privacy

### Do I need to create an account?

No! CloudPlay doesn't require any account or registration.

### What data does CloudPlay collect?

CloudPlay collects minimal data:

- **IP address**: For rate limiting (stored temporarily in KV)
- **Room IDs**: For token generation (not stored permanently)
- **Error logs**: For debugging (anonymized)

### Is my IP address exposed?

No! Other players only see your Cloudflare-assigned address (e.g., `myserver.cloudplay.app`), not your real IP.

### Can I delete my data?

Since CloudPlay doesn't store personal data permanently, there's nothing to delete. Rate limiting data is automatically purged.

## Contributing

### How can I contribute?

We welcome contributions! See our [Contributing Guide](../CONTRIBUTING.md) for details.

- Report bugs
- Suggest features
- Improve documentation
- Submit code

### Where is the source code?

The source code is on [GitHub](https://github.com/cloudplay/cloudplay).

### What license is CloudPlay under?

CloudPlay is licensed under the [GNU Affero General Public License v3.0](../LICENSE).

## Support

### Where can I get help?

- **GitHub Discussions**: Ask questions
- **Discord**: Join our community
- **Email**: support@cloudplay.app

### How do I report a bug?

Please use the [Bug Report](https://github.com/cloudplay/cloudplay/issues/new?template=bug_report.yml) template on GitHub.

### How do I request a feature?

Please use the [Feature Request](https://github.com/cloudplay/cloudplay/issues/new?template=feature_request.yml) template on GitHub.

### Is there a Discord server?

Yes! Join our Discord: [discord.gg/cloudplay](https://discord.gg/cloudplay)
