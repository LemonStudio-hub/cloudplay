use std::sync::Arc;
use tokio::sync::Mutex;
use tauri::{AppHandle, Emitter};
use tauri_plugin_shell::{ShellExt, process::CommandChild};
use crate::models::LogEntryPayload;

#[derive(Clone)]
pub struct TunnelManager {
    child: Arc<Mutex<Option<CommandChild>>>,
}

impl TunnelManager {
    pub fn new() -> Self {
        Self {
            child: Arc::new(Mutex::new(None)),
        }
    }

    /// Start tunnel with token using Tauri sidecar.
    /// Acquires the lock FIRST to prevent TOCTOU race conditions.
    pub async fn start_with_token(&self, app: &AppHandle, token: &str) -> Result<(), String> {
        // Acquire lock before checking — prevents two concurrent starts
        let mut guard = self.child.lock().await;
        if guard.is_some() {
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

        // Share child handle with the monitoring task so it can clear it on termination
        let child_handle = Arc::clone(&self.child);
        let app_handle = app.clone();

        // Monitor sidecar output and emit to frontend
        tokio::spawn(async move {
            use tauri_plugin_shell::process::CommandEvent;
            while let Some(event) = rx.recv().await {
                match event {
                    CommandEvent::Stdout(line) => {
                        let msg = String::from_utf8_lossy(&line).trim().to_string();
                        log::info!("[cloudflared:stdout] {}", msg);
                        let _ = app_handle.emit("log://entry",
                            LogEntryPayload::info("tunnel", &msg));
                    }
                    CommandEvent::Stderr(line) => {
                        let msg = String::from_utf8_lossy(&line).trim().to_string();
                        log::error!("[cloudflared:stderr] {}", msg);
                        let _ = app_handle.emit("log://entry",
                            LogEntryPayload::error("tunnel", &msg));
                    }
                    CommandEvent::Terminated(status) => {
                        let msg = format!("隧道进程退出: {:?}", status);
                        log::info!("[cloudflared] {}", msg);
                        let _ = app_handle.emit("log://entry",
                            LogEntryPayload::info("tunnel", &msg));
                        // Clear the child handle so is_running() returns false
                        let mut guard = child_handle.lock().await;
                        *guard = None;
                        break;
                    }
                    CommandEvent::Error(err) => {
                        log::error!("[cloudflared:error] {}", err);
                        let _ = app_handle.emit("log://entry",
                            LogEntryPayload::error("tunnel", &err));
                    }
                    _ => {}
                }
            }
        });

        *guard = Some(child);
        Ok(())
    }

    /// Stop tunnel and wait for the process to terminate.
    pub async fn stop(&self, app: &AppHandle) -> Result<(), String> {
        let mut guard = self.child.lock().await;
        if let Some(child) = guard.take() {
            child.kill().map_err(|e| format!("停止隧道失败: {}", e))?;
            log::info!("Tunnel stopped");
            let _ = app.emit("log://entry",
                LogEntryPayload::info("tunnel", "隧道进程已终止"));
        }
        Ok(())
    }

    /// Check if tunnel is running.
    /// Relies on the monitoring task clearing the handle on termination,
    /// so this correctly returns `false` for dead processes.
    pub async fn is_running(&self) -> bool {
        let guard = self.child.lock().await;
        guard.is_some()
    }
}
