use tokio::process::Child as TokioChild;
use tokio::io::{BufReader, AsyncBufReadExt};
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct TunnelManager {
    process: Arc<Mutex<Option<TokioChild>>>,
}

impl TunnelManager {
    pub fn new() -> Self {
        Self {
            process: Arc::new(Mutex::new(None)),
        }
    }

    /// Start tunnel with token
    pub async fn start_with_token(&self, token: &str) -> Result<(), String> {
        // Check if already running
        if self.is_running().await {
            return Err("Tunnel is already running".to_string());
        }

        let mut child = tokio::process::Command::new("cloudflared")
            .arg("tunnel")
            .arg("run")
            .arg("--token")
            .arg(token)
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .spawn()
            .map_err(|e| format!("Failed to spawn cloudflared: {}. Make sure cloudflared is installed.", e))?;

        let stdout = child.stdout.take().expect("Failed to capture stdout");
        let mut reader = BufReader::new(stdout).lines();

        // Spawn a task to read logs and forward to frontend
        tokio::spawn(async move {
            while let Ok(Some(line)) = reader.next_line().await {
                if line.contains("ERR") {
                    log::error!("[cloudflared] {}", line);
                } else {
                    log::info!("[cloudflared] {}", line);
                }
            }
        });

        // Save process handle
        let mut guard = self.process.lock().await;
        *guard = Some(child);
        Ok(())
    }

    /// Start access tunnel for client mode
    pub async fn start_access(&self, hostname: &str, local_port: u16) -> Result<(), String> {
        // Check if already running
        if self.is_running().await {
            return Err("Tunnel is already running".to_string());
        }

        let url = format!("localhost:{}", local_port);
        let mut child = tokio::process::Command::new("cloudflared")
            .arg("access")
            .arg("tcp")
            .arg("--hostname")
            .arg(hostname)
            .arg("--url")
            .arg(&url)
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .spawn()
            .map_err(|e| format!("Failed to spawn cloudflared: {}. Make sure cloudflared is installed.", e))?;

        let stdout = child.stdout.take().expect("Failed to capture stdout");
        let mut reader = BufReader::new(stdout).lines();

        // Spawn a task to read logs
        tokio::spawn(async move {
            while let Ok(Some(line)) = reader.next_line().await {
                if line.contains("ERR") {
                    log::error!("[cloudflared] {}", line);
                } else {
                    log::info!("[cloudflared] {}", line);
                }
            }
        });

        // Save process handle
        let mut guard = self.process.lock().await;
        *guard = Some(child);
        Ok(())
    }

    /// Stop tunnel
    pub async fn stop(&self) -> Result<(), String> {
        let mut guard = self.process.lock().await;
        if let Some(mut child) = guard.take() {
            child.kill().await.map_err(|e| format!("Failed to kill process: {}", e))?;
            log::info!("Tunnel stopped");
        }
        Ok(())
    }

    /// Check if tunnel is running
    pub async fn is_running(&self) -> bool {
        let guard = self.process.lock().await;
        guard.is_some()
    }
}
