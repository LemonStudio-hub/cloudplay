use std::path::PathBuf;
use std::sync::LazyLock;
use tokio::sync::Mutex;
use tauri::{AppHandle, Manager};
use tauri_plugin_shell::ShellExt;
use crate::models::SpeedTestResult;

/// Global mutex to prevent concurrent speed test executions.
static SPEED_TEST_LOCK: LazyLock<Mutex<()>> = LazyLock::new(|| Mutex::new(()));

/// Maximum time to wait for the speed test to complete (120 seconds).
const SPEED_TEST_TIMEOUT_SECS: u64 = 120;

/// Run CloudflareSpeedTest and return the fastest IP result.
/// Uses `-dd` (skip download speed test) for faster results.
/// Protected by a global mutex — only one speed test can run at a time.
pub async fn run_speed_test(app: &AppHandle) -> Result<SpeedTestResult, String> {
    // Prevent concurrent speed test runs
    let _guard = SPEED_TEST_LOCK.try_lock().map_err(|_| {
        log::warn!("Speed test already in progress");
        "测速正在进行中，请稍后再试".to_string()
    })?;

    // Determine output path in app cache directory
    let output_dir = app.path().app_cache_dir()
        .map_err(|e| format!("获取缓存目录失败: {}", e))?;
    std::fs::create_dir_all(&output_dir)
        .map_err(|e| format!("创建缓存目录失败: {}", e))?;
    let output_path = output_dir.join("cfst_result.csv");

    // Remove old result file if exists
    let _ = std::fs::remove_file(&output_path);

    let sidecar = app.shell()
        .sidecar("CloudflareSpeedTest")
        .map_err(|e| format!("加载 CloudflareSpeedTest 失败: {}", e))?;

    let output_arg = output_path.to_str()
        .ok_or_else(|| "输出路径包含无效字符".to_string())?;

    // Run with -dd (latency only, no download test) and -o for output
    let (mut rx, child) = sidecar
        .args(["-dd", "-o", output_arg])
        .spawn()
        .map_err(|e| format!("启动 CloudflareSpeedTest 失败: {}", e))?;

    // Wait for process to complete with timeout.
    // The child handle is kept alive in this scope — dropping it kills the process.
    use tauri_plugin_shell::process::CommandEvent;
    let result = tokio::time::timeout(
        std::time::Duration::from_secs(SPEED_TEST_TIMEOUT_SECS),
        async {
            while let Some(event) = rx.recv().await {
                match event {
                    CommandEvent::Terminated(status) => {
                        if !status.code.map_or(true, |c| c == 0) {
                            return Err(format!("CloudflareSpeedTest 退出码: {:?}", status.code));
                        }
                        return Ok(());
                    }
                    CommandEvent::Error(err) => {
                        return Err(format!("CloudflareSpeedTest 错误: {}", err));
                    }
                    _ => {}
                }
            }
            Ok(())
        }
    ).await;

    match result {
        Ok(Ok(())) => {
            // Process completed successfully — child drops naturally
        }
        Ok(Err(e)) => {
            drop(child); // Kill the process
            return Err(e);
        }
        Err(_) => {
            // Timeout — drop kills the process
            log::error!("Speed test timed out after {}s", SPEED_TEST_TIMEOUT_SECS);
            drop(child);
            return Err(format!("测速超时（{}秒），请检查网络连接", SPEED_TEST_TIMEOUT_SECS));
        }
    }

    // Parse CSV output
    parse_csv_output(&output_path)
}

/// Parse the CSV result file from CloudflareSpeedTest.
/// Format: IP, Sent, Received, Loss%, Latency, Speed
fn parse_csv_output(path: &PathBuf) -> Result<SpeedTestResult, String> {
    let content = std::fs::read_to_string(path)
        .map_err(|e| format!("读取测速结果失败: {}", e))?;

    // Skip header line, find first data line
    for line in content.lines() {
        let line = line.trim();
        // Skip empty lines, header lines, and lines starting with # or IP
        if line.is_empty() || line.starts_with('#') || line.starts_with("IP") {
            continue;
        }

        let parts: Vec<&str> = line.split(',').map(|s| s.trim()).collect();
        if parts.len() >= 5 {
            let ip = parts[0].to_string();
            let loss_str = parts[3].trim_end_matches('%');
            let latency_str = parts[4].trim_end_matches(" ms");
            let speed_str = if parts.len() > 5 {
                parts[5].trim_end_matches(" MB/s")
            } else {
                "0"
            };

            let loss = loss_str.parse::<f64>().unwrap_or_else(|_| {
                log::warn!("Failed to parse loss value: '{}'", loss_str);
                0.0
            });
            let latency = latency_str.parse::<f64>().unwrap_or_else(|_| {
                log::warn!("Failed to parse latency value: '{}'", latency_str);
                0.0
            });
            let speed = speed_str.parse::<f64>().unwrap_or_else(|_| {
                log::warn!("Failed to parse speed value: '{}'", speed_str);
                0.0
            });

            return Ok(SpeedTestResult {
                ip,
                latency_ms: latency,
                loss_percent: loss,
                speed_mbps: speed,
            });
        }
    }

    Err("测速结果为空，请检查网络连接".to_string())
}
