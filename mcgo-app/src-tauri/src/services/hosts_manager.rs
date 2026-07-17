use std::path::PathBuf;

const MARKER_START: &str = "# >>> CloudPlay Speed Optimizer";
const MARKER_END: &str = "# <<< CloudPlay Speed Optimizer";

/// Domains to optimize for Cloudflare connections
const CLOUDFLARE_DOMAINS: &[&str] = &[
    "cloudplay.lat",
    "api.cloudplay.lat",
];

/// Get the hosts file path for the current platform.
fn hosts_path() -> PathBuf {
    #[cfg(target_os = "windows")]
    {
        PathBuf::from(r"C:\Windows\System32\drivers\etc\hosts")
    }
    #[cfg(not(target_os = "windows"))]
    {
        PathBuf::from("/etc/hosts")
    }
}

/// Read the hosts file content.
fn read_hosts() -> Result<String, String> {
    let path = hosts_path();
    std::fs::read_to_string(&path)
        .map_err(|e| format!("读取 hosts 文件失败: {}", e))
}

/// Remove existing CloudPlay entries from hosts content.
fn remove_existing_entries(content: &str) -> String {
    let mut result = String::new();
    let mut in_block = false;

    for line in content.lines() {
        if line.trim() == MARKER_START {
            in_block = true;
            continue;
        }
        if line.trim() == MARKER_END {
            in_block = false;
            continue;
        }
        if !in_block {
            result.push_str(line);
            result.push('\n');
        }
    }

    // Remove trailing newlines
    result.trim_end().to_string()
}

/// Generate hosts entries for the given IP.
fn generate_entries(ip: &str) -> String {
    let mut entries = String::new();
    entries.push_str(&format!("{}\n", MARKER_START));
    for domain in CLOUDFLARE_DOMAINS {
        entries.push_str(&format!("{} {}\n", ip, domain));
    }
    entries.push_str(MARKER_END);
    entries
}

/// Write content to the hosts file with elevated privileges.
fn write_hosts_elevated(content: &str) -> Result<(), String> {
    let path = hosts_path();
    let path_str = path.to_string_lossy().to_string();

    #[cfg(target_os = "windows")]
    {
        // Use PowerShell to write with admin privileges
        let script = format!(
            "Set-Content -Path '{}' -Value '{}' -NoNewline -Encoding UTF8",
            path_str.replace('\'', "''"),
            content.replace('\'', "''")
        );
        let status = std::process::Command::new("powershell")
            .args(["-Command", &format!(
                "Start-Process powershell -Verb RunAs -ArgumentList '-Command {}'",
                script.replace('"', "\\\"")
            )])
            .status()
            .map_err(|e| format!("执行提权命令失败: {}", e))?;

        if !status.success() {
            return Err("需要管理员权限来修改 hosts 文件".to_string());
        }
    }

    #[cfg(target_os = "linux")]
    {
        // Try pkexec first, fallback to sudo
        let temp_file = "/tmp/cloudplay_hosts_temp";
        std::fs::write(temp_file, content)
            .map_err(|e| format!("写入临时文件失败: {}", e))?;

        let result = std::process::Command::new("pkexec")
            .args(["cp", temp_file, &path_str])
            .status();

        match result {
            Ok(status) if status.success() => {
                let _ = std::fs::remove_file(temp_file);
                return Ok(());
            }
            _ => {
                // Fallback to sudo
                let status = std::process::Command::new("sudo")
                    .args(["cp", temp_file, &path_str])
                    .status()
                    .map_err(|e| format!("执行 sudo 失败: {}", e))?;
                let _ = std::fs::remove_file(temp_file);
                if !status.success() {
                    return Err("需要管理员权限来修改 hosts 文件".to_string());
                }
            }
        }
    }

    #[cfg(target_os = "macos")]
    {
        // Use osascript for macOS authorization dialog
        let escaped_content = content.replace('\\', "\\\\").replace('"', "\\\"");
        let script = format!(
            "do shell script \"cat > {} << 'HOSTSEOF'\\n{}\\nHOSTSEOF\" with administrator privileges",
            path_str, escaped_content
        );
        let status = std::process::Command::new("osascript")
            .args(["-e", &script])
            .status()
            .map_err(|e| format!("执行授权命令失败: {}", e))?;

        if !status.success() {
            return Err("需要管理员权限来修改 hosts 文件".to_string());
        }
    }

    Ok(())
}

/// Apply speed optimization: write the fastest IP to hosts file.
pub fn apply_optimization(ip: &str) -> Result<(), String> {
    let content = read_hosts()?;
    let cleaned = remove_existing_entries(&content);
    let entries = generate_entries(ip);

    let new_content = if cleaned.is_empty() {
        entries
    } else {
        format!("{}\n{}", cleaned, entries)
    };

    write_hosts_elevated(&new_content)?;
    log::info!("Speed optimization applied: {}", ip);
    Ok(())
}

/// Remove speed optimization entries from hosts file.
pub fn remove_optimization() -> Result<(), String> {
    let content = read_hosts()?;
    let cleaned = remove_existing_entries(&content);

    // Only write if we actually removed something
    if content.contains(MARKER_START) {
        write_hosts_elevated(&cleaned)?;
        log::info!("Speed optimization removed");
    }
    Ok(())
}

/// Get the currently applied optimization IP from hosts file.
pub fn get_current_ip() -> Option<String> {
    let content = read_hosts().ok()?;
    let mut in_block = false;

    for line in content.lines() {
        if line.trim() == MARKER_START {
            in_block = true;
            continue;
        }
        if line.trim() == MARKER_END {
            break;
        }
        if in_block {
            // Parse "IP domain" format
            let parts: Vec<&str> = line.split_whitespace().collect();
            if !parts.is_empty() {
                return Some(parts[0].to_string());
            }
        }
    }

    None
}
