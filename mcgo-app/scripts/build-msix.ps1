# CloudPlay MSIX Build Script for Windows
# Prerequisites:
#   1. Windows SDK installed (for MakeAppx.exe and signtool.exe)
#   2. Rust with x86_64-pc-windows-msvc target
#   3. Node.js + pnpm
#   4. (Optional) PFX certificate for code signing

param(
    [string]$Arch = "x64",
    [switch]$Sign,
    [string]$PfxPath,
    [string]$PfxPassword
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$SrcTauri = Join-Path $ProjectRoot "src-tauri"
$WindowsDir = Join-Path $SrcTauri "gen\windows"
$AssetsDir = Join-Path $WindowsDir "Assets"
$ConfigFile = Join-Path $WindowsDir "bundle.config.json"
$ManifestTemplate = Join-Path $WindowsDir "AppxManifest.xml.template"
$TargetDir = Join-Path $ProjectRoot "target"
$MsixDir = Join-Path $TargetDir "msix"

Write-Host "=== CloudPlay MSIX Builder ===" -ForegroundColor Cyan
Write-Host "Architecture: $Arch" -ForegroundColor Gray

# Step 1: Build frontend
Write-Host "`n[1/6] Building frontend..." -ForegroundColor Yellow
Push-Location $ProjectRoot
pnpm run build
Pop-Location

# Step 2: Build Tauri app for Windows
Write-Host "`n[2/6] Building Tauri app..." -ForegroundColor Yellow
Push-Location $ProjectRoot
cargo tauri build --target "x86_64-pc-windows-msvc" --bundles none
Pop-Location

# Step 3: Prepare MSIX content directory
Write-Host "`n[3/6] Preparing MSIX content..." -ForegroundColor Yellow
$ContentDir = Join-Path $MsixDir "content_$Arch"
if (Test-Path $ContentDir) { Remove-Item -Recurse -Force $ContentDir }
New-Item -ItemType Directory -Path $ContentDir -Force | Out-Null

# Copy built executable (Tauri cargo package name is cloudplay-app)
$ReleaseDir = Join-Path $TargetDir "x86_64-pc-windows-msvc\release"
$ExeSource = Join-Path $ReleaseDir "cloudplay-app.exe"
if (-not (Test-Path $ExeSource)) {
    Write-Error "Built executable not found at: $ExeSource"
    exit 1
}
Copy-Item $ExeSource (Join-Path $ContentDir "CloudPlay.exe")

# Copy cloudflared sidecar binary
$SidecarSource = Join-Path $ReleaseDir "cloudflared.exe"
if (-not (Test-Path $SidecarSource)) {
    Write-Error "Sidecar binary not found at: $SidecarSource"
    exit 1
}
Copy-Item $SidecarSource $ContentDir
Write-Host "  Sidecar: cloudflared.exe ($([math]::Round((Get-Item $SidecarSource).Length/1MB, 1)) MB)" -ForegroundColor Gray

# Copy Assets
$ContentAssets = Join-Path $ContentDir "Assets"
New-Item -ItemType Directory -Path $ContentAssets -Force | Out-Null
Copy-Item "$AssetsDir\*" $ContentAssets -Recurse

# Step 4: Generate AppxManifest.xml
Write-Host "`n[4/6] Generating AppxManifest.xml..." -ForegroundColor Yellow
$Config = Get-Content $ConfigFile | ConvertFrom-Json
$TauriConf = Get-Content (Join-Path $SrcTauri "tauri.conf.json") | ConvertFrom-Json

$Manifest = Get-Content $ManifestTemplate -Raw
$Manifest = $Manifest -replace '\{\{identifier\}\}', $TauriConf.identifier
$Manifest = $Manifest -replace '\{\{publisher\}\}', $Config.publisher
$Manifest = $Manifest -replace '\{\{version\}\}', ($TauriConf.version + ".0")
$Manifest = $Manifest -replace '\{\{arch\}\}', $Arch
$Manifest = $Manifest -replace '\{\{displayName\}\}', $TauriConf.productName
$Manifest = $Manifest -replace '\{\{publisherDisplayName\}\}', $Config.publisherDisplayName
$Manifest = $Manifest -replace '\{\{description\}\}', $TauriConf.description
$Manifest = $Manifest -replace '\{\{exeName\}\}', "CloudPlay.exe"

$Manifest | Out-File -FilePath (Join-Path $ContentDir "AppxManifest.xml") -Encoding UTF8

# Step 5: Create MSIX package
Write-Host "`n[5/6] Creating MSIX package..." -ForegroundColor Yellow
$MakeAppx = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\MakeAppx.exe"
if (-not (Test-Path $MakeAppx)) {
    # Try to find MakeAppx in PATH
    $MakeAppx = (Get-Command MakeAppx.exe -ErrorAction SilentlyContinue).Source
    if (-not $MakeAppx) {
        Write-Error "MakeAppx.exe not found. Install Windows SDK."
        exit 1
    }
}

$MsixFile = Join-Path $MsixDir "CloudPlay_$Arch.msix"
& $MakeAppx pack /d $ContentDir /p $MsixFile /o

# Step 6: Sign (optional)
if ($Sign -and $PfxPath) {
    Write-Host "`n[6/6] Signing MSIX..." -ForegroundColor Yellow
    $SignTool = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\signtool.exe"
    if (-not (Test-Path $SignTool)) {
        $SignTool = (Get-Command signtool.exe -ErrorAction SilentlyContinue).Source
    }
    if ($SignTool) {
        $SignArgs = @("sign", "/fd", "SHA256", "/a")
        if ($PfxPath) { $SignArgs += @("/f", $PfxPath) }
        if ($PfxPassword) { $SignArgs += @("/p", $PfxPassword) }
        $SignArgs += $MsixFile
        & $SignTool @SignArgs
    } else {
        Write-Warning "signtool.exe not found. Skipping signing."
    }
} else {
    Write-Host "`n[6/6] Skipping signing (use -Sign with -PfxPath to enable)" -ForegroundColor Gray
}

Write-Host "`n=== Done ===" -ForegroundColor Green
Write-Host "MSIX package: $MsixFile" -ForegroundColor Cyan
Write-Host "`nTo install: Double-click the .msix file or run:" -ForegroundColor Gray
Write-Host "  Add-AppxPackage -Path '$MsixFile'" -ForegroundColor White
