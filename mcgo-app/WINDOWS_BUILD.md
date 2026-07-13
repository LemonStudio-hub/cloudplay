# CloudPlay Windows Build Guide

## Quick Start (Pre-built)

Download `cloudplay-windows-x64.zip` and run `install.bat` as administrator.

## Building MSI Installer (Windows Only)

To build a proper MSI installer, you need to build on Windows with the following tools:

### Prerequisites

1. **Visual Studio 2022** or **Build Tools for Visual Studio 2022**
   - Install with "Desktop development with C++" workload
   - Download: https://visualstudio.microsoft.com/downloads/

2. **Rust** (latest stable)
   - Install: https://rustup.rs/

3. **Node.js** (v18 or later)
   - Install: https://nodejs.org/

4. **WiX Toolset v3** (for MSI creation)
   - Install: https://wixtoolset.org/releases/

### Build Steps

1. **Clone the repository**
   ```powershell
   git clone https://github.com/cloudplay/mcgo.git
   cd cloudplay/cloudplay-app
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Build the frontend**
   ```powershell
   npm run build
   ```

4. **Build the Tauri application**
   ```powershell
   npx tauri build
   ```

5. **Create MSI installer**
   ```powershell
   cd src-tauri
   cargo wix
   ```

The MSI installer will be created in `src-tauri/target/x86_64-pc-windows-msvc/release/wix/`.

### Cross-Compilation from Linux

If you need to cross-compile from Linux, use:

```bash
# Install prerequisites
rustup target add x86_64-pc-windows-msvc
cargo install cargo-xwin

# Create icon symlink
mkdir -p ~/bin
ln -sf /usr/bin/llvm-rc-18 ~/bin/llvm-rc

# Build
export PATH="$HOME/bin:$PATH"
cargo xwin build --release --target x86_64-pc-windows-msvc
```

Note: Cross-compilation only builds the binary. MSI packaging requires Windows.

## Installer Options

### Option 1: Batch Installer (Recommended for quick distribution)

Files in `dist/windows/`:
- `cloudplay-app.exe` - Main application
- `install.bat` - Installer script
- `uninstall.bat` - Uninstaller script
- `README.txt` - User documentation

**Features:**
- Automatic installation to `%LOCALAPPDATA%\CloudPlay`
- Desktop and Start Menu shortcuts
- PATH environment variable setup
- Clean uninstaller

### Option 2: MSI Installer (Recommended for enterprise)

Build using `cargo wix` on Windows. Benefits:
- Standard Windows installer experience
- Add/Remove Programs integration
- Silent installation support
- Group Policy deployment

### Option 3: Portable

Simply run `cloudplay-app.exe` directly. No installation required.

## Distribution

### For end users:
- Provide the zip file (`cloudplay-windows-x64.zip`)
- Users extract and run `install.bat`

### For enterprise:
- Build MSI installer
- Deploy via Group Policy or SCCM
- Silent install: `msiexec /i cloudplay.msi /quiet`

## Troubleshooting

### "Windows protected your PC" warning

The application is not signed. To remove this warning:
1. Click "More info"
2. Click "Run anyway"

Or purchase a code signing certificate and sign the executable.

### Application won't start

1. Make sure you have the latest Windows updates
2. Install [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) if not already installed
3. Try running as administrator

### Antivirus false positive

Some antivirus software may flag unsigned executables. This is a false positive. You can:
1. Add an exception in your antivirus
2. Submit the file for analysis to your antivirus vendor
3. Code sign the application

## Code Signing

To remove SmartScreen warnings and improve trust:

1. Purchase a code signing certificate from a CA (e.g., DigiCert, Sectigo)
2. Sign the executable:
   ```powershell
   signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com cloudplay-app.exe
   ```
3. Sign the MSI:
   ```powershell
   signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com cloudplay.msi
   ```

---

For more information, visit https://cloudplay.lat
