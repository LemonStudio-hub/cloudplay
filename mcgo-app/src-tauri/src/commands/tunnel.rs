use tauri::State;
use crate::models::{AppState, StartTunnelRequest, StartTunnelResponse};
use crate::services::port_scanner::is_port_available;

#[tauri::command]
pub async fn start_tunnel(
    state: State<'_, AppState>,
    request: StartTunnelRequest,
) -> Result<StartTunnelResponse, String> {
    log::info!("Starting tunnel for room: {}, port: {}", request.room_id, request.local_port);

    // 1. Check if port is available
    if !is_port_available(request.local_port) {
        return Ok(StartTunnelResponse {
            success: false,
            hostname: None,
            error: Some(format!("Port {} is already in use", request.local_port)),
        });
    }

    // 2. Request token from Worker API
    let api_client = &state.api_client;
    let token_response = api_client.request_token(&request.room_id).await?;

    if !token_response.success {
        return Ok(StartTunnelResponse {
            success: false,
            hostname: None,
            error: token_response.error,
        });
    }

    let token_data = match token_response.data {
        Some(data) => data,
        None => {
            return Ok(StartTunnelResponse {
                success: false,
                hostname: None,
                error: Some("Missing token data in response".to_string()),
            });
        }
    };

    let hostname = token_data.hostname.clone();

    // 3. Store hostname in state
    *state.current_hostname.lock().await = Some(hostname.clone());

    // 4. Start cloudflared tunnel
    let tunnel_manager = &state.tunnel_manager;
    tunnel_manager.start_with_token(&token_data.token).await?;

    log::info!("Tunnel started successfully: {}", hostname);

    Ok(StartTunnelResponse {
        success: true,
        hostname: Some(hostname),
        error: None,
    })
}

#[tauri::command]
pub async fn stop_tunnel(state: State<'_, AppState>) -> Result<(), String> {
    log::info!("Stopping tunnel");

    let tunnel_manager = &state.tunnel_manager;
    tunnel_manager.stop().await?;

    *state.current_hostname.lock().await = None;

    log::info!("Tunnel stopped");
    Ok(())
}
