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

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(AppState {
            tunnel_manager,
            api_client,
            current_hostname: Arc::new(Mutex::new(None)),
        })
        .setup(|app| {
            use tauri::Manager;

            // Force Cloudflare brand icon onto the window (taskbar) immediately
            if let Some(win) = app.get_webview_window("main") {
                const ICON_PNG: &[u8] = include_bytes!("../icons/icon-256.png");
                match tauri::image::Image::from_bytes(ICON_PNG) {
                    Ok(icon) => {
                        if let Err(e) = win.set_icon(icon) {
                            log::warn!("set_icon failed: {e}");
                        }
                    }
                    Err(e) => log::warn!("icon decode failed: {e}"),
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::tunnel::start_tunnel,
            commands::tunnel::stop_tunnel,
            commands::port::check_port,
            commands::cloudflared::check_cloudflared,
            commands::speed::run_speed_test,
            commands::speed::apply_speed_optimization,
            commands::speed::remove_speed_optimization,
            commands::speed::get_speed_status,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
