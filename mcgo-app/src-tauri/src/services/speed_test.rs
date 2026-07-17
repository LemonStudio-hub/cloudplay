use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use tauri_plugin_shell::ShellExt;
use crate::models::SpeedTestResult;

/// Run CloudflareSpeedTest and return the fastest IP result.
/// Uses `-dd` (skip download speed test) for faster results.
pub async fn run_speed_test(app: &AppHandle) -> Result<SpeedTestResult, String> {
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

    // Run with -dd (latency only, no download test) and -o for output
    let (mut rx, _child) = sidecar
        .args([
            "-dd",
            "-o", output_path.to_str().unwrap_or("cfst_result.csv"),
        ])
        .spawn()
        .map_err(|e| format!("启动 CloudflareSpeedTest 失败: {}", e))?;

    // Wait for process to complete
    use tauri_plugin_shell::process::CommandEvent;
    while let Some(event) = rx.recv().await {
        match event {
            CommandEvent::Terminated(status) => {
                if !status.code.map_or(true, |c| c == 0) {
                    return Err(format!("CloudflareSpeedTest 退出码: {:?}", status.code));
                }
                break;
            }
            CommandEvent::Error(err) => {
                return Err(format!("CloudflareSpeedTest 错误: {}", err));
            }
            _ => {}
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

            let loss = loss_str.parse::<f64>().unwrap_or(0.0);
            let latency = latency_str.parse::<f64>().unwrap_or(0.0);
            let speed = speed_str.parse::<f64>().unwrap_or(0.0);

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
