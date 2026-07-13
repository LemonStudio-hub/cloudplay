mod commands;
mod models;
mod services;

use models::AppState;
use services::cloudflared::TunnelManager;
use services::api_client::ApiClient;
use std::sync::Arc;
use tokio::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let tunnel_manager = TunnelManager::new();
    let api_client = ApiClient::new("https://api.cloudplay.lat".to_string());

    let state = AppState {
        tunnel_manager,
        api_client,
        current_hostname: Arc::new(Mutex::new(None)),
    };

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            commands::tunnel::start_tunnel,
            commands::tunnel::stop_tunnel,
            commands::port::check_port,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
