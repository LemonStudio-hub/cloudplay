# Troubleshooting Guide

This guide helps you diagnose and fix common issues with CloudPlay.

## Quick Diagnostics

### Check Application Status

```bash
# Check if cloudflared is running
ps aux | grep cloudflared

# Check if the app is listening
netstat -tlnp | grep cloudplay

# Check logs
tail -f ~/.cloudplay/logs/app.log
```

### Check Network Connectivity

```bash
# Test internet connection
ping -c 4 1.1.1.1

# Test Cloudflare connectivity
curl -I https://api.cloudflare.com

# Test API endpoint
curl https://api.cloudplay.app/api/health
```

### Check System Resources

```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU usage
top -bn1 | head -20
```

## Common Issues

### Installation Issues

#### Windows: SmartScreen Warning

**Symptom:** "Windows protected your PC" warning

**Solution:**
1. Click "More info"
2. Click "Run anyway"

**Note:** This occurs because the app is not yet code-signed. We're working on obtaining a certificate.

#### macOS: Unidentified Developer

**Symptom:** "CloudPlay can't be opened because it is from an unidentified developer"

**Solution:**
1. Right-click the app and select "Open"
2. Click "Open" in the dialog

**Alternative:**
```bash
xattr -cr /Applications/CloudPlay.app
```

#### Linux: Missing Dependencies

**Symptom:** App fails to start with library errors

**Solution:**
```bash
# Ubuntu/Debian
sudo apt install libdbus-1-dev libwebkit2gtk-4.1-dev libgtk-3-dev \
  libayatana-appindicator3-dev librsvg2-dev

# Fedora
sudo dnf install dbus-devel webkit2gtk4.1-devel gtk3-devel \
  libayatana-appindicator-gtk3-devel librsvg2-devel

# Arch
sudo pacman -S dbus webkit2gtk-4.1 gtk3 libayatana-appindicator librsvg
```

#### Installation Fails

**Symptom:** Installer crashes or fails to complete

**Solution:**
1. Run installer as administrator
2. Disable antivirus temporarily
3. Check disk space
4. Check Windows Event Viewer for errors

### Connection Issues

#### "Failed to spawn cloudflared"

**Symptom:** Error when starting tunnel

**Causes:**
- `cloudflared` binary not found
- Binary is corrupted
- Antivirus blocking execution

**Solution:**
1. **Reinstall the app**
2. **Check antivirus:** Add CloudPlay to exceptions
3. **Manual installation:**
   ```bash
   # Download cloudflared
   # Windows: https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
   # macOS: https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-amd64.tgz
   # Linux: https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
   
   # Place in CloudPlay directory
   # Windows: %LOCALAPPDATA%\CloudPlay\
   # macOS: ~/.cloudplay/bin/
   # Linux: ~/.cloudplay/bin/
   ```

#### "Port already in use"

**Symptom:** Cannot start tunnel, port conflict

**Causes:**
- Another application using the port
- Previous CloudPlay instance still running

**Solution:**
1. **Find the conflict:**
   ```bash
   # Windows
   netstat -ano | findstr :25565
   
   # macOS/Linux
   lsof -i :25565
   ```

2. **Kill the process:**
   ```bash
   # Windows
   taskkill /PID <PID> /F
   
   # macOS/Linux
   kill -9 <PID>
   ```

3. **Use a different port:** Change the port in CloudPlay settings

#### "Connection refused"

**Symptom:** Cannot connect to host

**Causes:**
- Host tunnel not running
- Wrong address
- Firewall blocking

**Solution:**
1. **Verify host is running:** Ask host to check tunnel status
2. **Check address:** Ensure correct format (e.g., `myserver.cloudplay.app`)
3. **Check firewall:**
   ```bash
   # Windows
   netsh advfirewall firewall show rule name=all | findstr CloudPlay
   
   # macOS
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --listapps
   
   # Linux
   sudo iptables -L -n | grep cloudplay
   ```

#### "Connection timeout"

**Symptom:** Connection attempt times out

**Causes:**
- Network issues
- Cloudflare issues
- Tunnel not established

**Solution:**
1. **Check internet:** Run speed test
2. **Try different network:** Switch to mobile hotspot
3. **Wait and retry:** Cloudflare may be experiencing issues
4. **Check status:** Visit [Cloudflare Status](https://www.cloudflarestatus.com/)

### Performance Issues

#### High Latency

**Symptom:** Game feels laggy

**Causes:**
- Network congestion
- Geographic distance
- Game settings

**Solution:**
1. **Check ping:**
   ```bash
   # Test latency to Cloudflare
   ping -c 10 1.1.1.1
   ```

2. **Close background apps:** Reduce bandwidth usage
3. **Use wired connection:** WiFi can add latency
4. **Optimize game settings:** Reduce view distance, render quality

#### High CPU Usage

**Symptom:** Computer slows down during play

**Causes:**
- cloudflared process using too much CPU
- Game optimization issues

**Solution:**
1. **Check CPU usage:**
   ```bash
   # Windows
   tasklist | findstr cloudflared
   
   # macOS/Linux
   ps aux | grep cloudflared
   ```

2. **Restart tunnel:** Stop and start tunnel again
3. **Update cloudflared:** Use latest version
4. **Limit bandwidth:** Set bandwidth limit in game settings

#### Disconnections

**Symptom:** Frequent disconnections

**Causes:**
- Unstable internet
- WiFi interference
- VPN interference

**Solution:**
1. **Use wired connection**
2. **Disable VPN**
3. **Check router settings**
4. **Monitor connection:**
   ```bash
   # Continuous ping test
   ping -t 1.1.1.1
   ```

### API Issues

#### "Rate limit exceeded"

**Symptom:** Cannot generate tokens

**Causes:**
- Too many requests
- Automated requests

**Solution:**
1. **Wait:** Rate limits reset after 1 minute
2. **Reduce requests:** Don't spam the button
3. **Check for bugs:** Report if this happens repeatedly

#### "Invalid room ID"

**Symptom:** Cannot create tunnel

**Causes:**
- Room ID too short/long
- Invalid characters

**Solution:**
1. **Check length:** Must be 3-20 characters
2. **Check characters:** Only `[a-zA-Z0-9_-]`
3. **No spaces:** Remove any spaces

#### API Not Responding

**Symptom:** Cannot connect to API

**Causes:**
- Worker not deployed
- DNS issues
- Cloudflare issues

**Solution:**
1. **Check API health:**
   ```bash
   curl https://api.cloudplay.app/api/health
   ```

2. **Check DNS:**
   ```bash
   nslookup api.cloudplay.app
   ```

3. **Check Cloudflare status:** Visit [cloudflarestatus.com](https://www.cloudflarestatus.com/)

### Application Issues

#### App Won't Start

**Symptom:** Application crashes on startup

**Causes:**
- Missing dependencies
- Corrupted installation
- Antivirus blocking

**Solution:**
1. **Reinstall the app**
2. **Check antivirus:** Add CloudPlay to exceptions
3. **Check logs:**
   ```bash
   # Windows
   type %LOCALAPPDATA%\CloudPlay\logs\app.log
   
   # macOS/Linux
   cat ~/.cloudplay/logs/app.log
   ```

4. **Run from terminal:**
   ```bash
   # Windows
   cd %LOCALAPPDATA%\CloudPlay
   cloudplay-app.exe
   
   # macOS/Linux
   cd ~/.cloudplay
   ./cloudplay-app
   ```

#### UI Not Rendering

**Symptom:** Blank or broken UI

**Causes:**
- WebView issues
- Graphics driver issues

**Solution:**
1. **Update graphics drivers**
2. **Update WebView:**
   - Windows: Install [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
   - macOS: Update macOS
   - Linux: Update WebKitGTK

3. **Disable hardware acceleration:** Add `--disable-gpu` flag

#### Settings Not Saving

**Symptom:** Settings reset after restart

**Causes:**
- Permission issues
- Corrupted config file

**Solution:**
1. **Check permissions:**
   ```bash
   # Windows
   icacls %LOCALAPPDATA%\CloudPlay
   
   # macOS/Linux
   ls -la ~/.cloudplay
   ```

2. **Delete config:**
   ```bash
   # Windows
   del %LOCALAPPDATA%\CloudPlay\config.json
   
   # macOS/Linux
   rm ~/.cloudplay/config.json
   ```

## Advanced Troubleshooting

### Collecting Logs

#### Windows

```powershell
# Collect logs
$logs = Get-Content "$env:LOCALAPPDATA\CloudPlay\logs\app.log" -Tail 100
$logs | Out-File -FilePath "$HOME\Desktop\cloudplay-logs.txt"

# Collect system info
systeminfo >> "$HOME\Desktop\cloudplay-logs.txt"
```

#### macOS/Linux

```bash
# Collect logs
tail -100 ~/.cloudplay/logs/app.log > ~/Desktop/cloudplay-logs.txt

# Collect system info
uname -a >> ~/Desktop/cloudplay-logs.txt
cat /etc/os-release >> ~/Desktop/cloudplay-logs.txt
```

### Network Diagnostics

```bash
# Trace route to Cloudflare
traceroute 1.1.1.1

# Test DNS resolution
nslookup api.cloudplay.app
nslookup *.cloudplay.app

# Test TCP connection
telnet api.cloudplay.app 443

# Test HTTPS
curl -v https://api.cloudplay.app/api/health
```

### Process Diagnostics

```bash
# Check running processes
ps aux | grep -E "(cloudplay|cloudflared)"

# Check open files
lsof -p <PID>

# Check network connections
netstat -an | grep cloudplay
```

### Memory Diagnostics

```bash
# Check memory usage
ps aux | grep cloudplay | awk '{print $6}'

# Check for memory leaks
valgrind --leak-check=full ./cloudplay-app
```

## Reporting Issues

When reporting issues, please include:

1. **System Information:**
   - OS and version
   - CloudPlay version
   - Node.js version (if applicable)
   - Rust version (if applicable)

2. **Steps to Reproduce:**
   - Detailed steps
   - Expected behavior
   - Actual behavior

3. **Logs:**
   - Application logs
   - System logs
   - Network logs

4. **Screenshots:**
   - Error messages
   - UI issues

5. **Additional Context:**
   - Network configuration
   - Antivirus software
   - VPN usage

## Getting Help

If you can't resolve the issue:

1. **Search existing issues:** [GitHub Issues](https://github.com/cloudplay/cloudplay/issues)
2. **Ask in Discussions:** [GitHub Discussions](https://github.com/cloudplay/cloudplay/discussions)
3. **Join Discord:** [discord.gg/cloudplay](https://discord.gg/cloudplay)
4. **Email support:** support@cloudplay.app
