use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;
use crate::services::cloudflared::TunnelManager;
use crate::services::api_client::ApiClient;

/// Application global state
pub struct AppState {
    pub tunnel_manager: TunnelManager,
    pub api_client: ApiClient,
    pub current_hostname: Arc<Mutex<Option<String>>>,
}

/// Log entry emitted to the frontend via Tauri events
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LogEntryPayload {
    pub level: String,      // "info" | "warn" | "error"
    pub category: String,   // "tunnel" | "system"
    pub message: String,
    pub data: Option<String>,
}

impl LogEntryPayload {
    pub fn info(category: &str, message: impl Into<String>) -> Self {
        Self {
            level: "info".into(),
            category: category.into(),
            message: message.into(),
            data: None,
        }
    }

    pub fn warn(category: &str, message: impl Into<String>) -> Self {
        Self {
            level: "warn".into(),
            category: category.into(),
            message: message.into(),
            data: None,
        }
    }

    pub fn error(category: &str, message: impl Into<String>) -> Self {
        Self {
            level: "error".into(),
            category: category.into(),
            message: message.into(),
            data: None,
        }
    }

    pub fn with_data(mut self, data: impl std::fmt::Display) -> Self {
        self.data = Some(data.to_string());
        self
    }
}

/// Token API response
#[derive(Debug, Deserialize)]
pub struct TokenResponse {
    pub success: bool,
    pub data: Option<TokenData>,
    pub error: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct TokenData {
    pub hostname: String,
    pub token: String,
    #[allow(dead_code)]
    #[serde(rename = "expiresIn")]
    pub expires_in: u64,
}

/// Tunnel start request
#[derive(Debug, Deserialize)]
pub struct StartTunnelRequest {
    pub room_id: String,
    pub local_port: u16,
}

/// Tunnel start response
#[derive(Debug, Serialize)]
pub struct StartTunnelResponse {
    pub success: bool,
    pub hostname: Option<String>,
    pub error: Option<String>,
}

/// Speed test result
#[derive(Debug, Clone, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SpeedTestResult {
    pub ip: String,
    pub latency_ms: f64,
    pub loss_percent: f64,
    pub speed_mbps: f64,
}

/// Speed optimization status
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SpeedStatus {
    pub enabled: bool,
    pub current_ip: Option<String>,
}
