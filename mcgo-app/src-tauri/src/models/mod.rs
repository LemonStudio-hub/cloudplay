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
