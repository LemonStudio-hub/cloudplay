use std::sync::Arc;
use tokio::sync::Mutex;
use tauri::AppHandle;
use tauri_plugin_shell::{ShellExt, process::CommandChild};

pub struct TunnelManager {
    child: Arc<Mutex<Option<CommandChild>>>,
}

impl TunnelManager {
    pub fn new() -> Self {
        Self {
            child: Arc::new(Mutex::new(None)),
        }
    }

    /// Start tunnel with token using Tauri sidecar
    pub async fn start_with_token(&self, app: &AppHandle, token: &str) -> Result<(), String> {
        if self.is_running().await {
            return Err("隧道已在运行中".to_string());
        }

        let sidecar = app.shell()
            .sidecar("cloudflared")
            .map_err(|e| format!("加载 cloudflared 失败: {}", e))?;

        let (mut rx, child) = sidecar
            .args(["tunnel", "run", "--token", token])
            .spawn()
            .map_err(|e| {
                log::error!("Failed to spawn cloudflared sidecar: {}", e);
                "启动 cloudflared 失败，请确认应用完整性".to_string()
            })?;

        // 监听 sidecar 输出用于日志
        tokio::spawn(async move {
            use tauri_plugin_shell::process::CommandEvent;
            while let Some(event) = rx.recv().await {
                match event {
                    CommandEvent::Stdout(line) => {
                        let msg = String::from_utf8_lossy(&line);
                        log::info!("[cloudflared:stdout] {}", msg);
                    }
                    CommandEvent::Stderr(line) => {
                        let msg = String::from_utf8_lossy(&line);
                        log::error!("[cloudflared:stderr] {}", msg);
                    }
                    CommandEvent::Terminated(status) => {
                        log::info!("[cloudflared] 进程退出: {:?}", status);
                        break;
                    }
                    CommandEvent::Error(err) => {
                        log::error!("[cloudflared:error] {}", err);
                    }
                    _ => {}
                }
            }
        });

        let mut guard = self.child.lock().await;
        *guard = Some(child);
        Ok(())
    }

    /// Stop tunnel
    pub async fn stop(&self) -> Result<(), String> {
        let mut guard = self.child.lock().await;
        if let Some(child) = guard.take() {
            child.kill().map_err(|e| format!("停止隧道失败: {}", e))?;
            log::info!("Tunnel stopped");
        }
        Ok(())
    }

    /// Check if tunnel is running
    pub async fn is_running(&self) -> bool {
        let guard = self.child.lock().await;
        guard.is_some()
    }
}
