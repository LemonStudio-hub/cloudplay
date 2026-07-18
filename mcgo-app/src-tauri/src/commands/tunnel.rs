use tauri::{AppHandle, Emitter, State};
use crate::models::{AppState, LogEntryPayload, StartTunnelRequest, StartTunnelResponse};
use crate::services::port_scanner::is_port_available;

/// Validate room ID format: 3-20 characters, alphanumeric, underscores, hyphens.
fn validate_room_id(room_id: &str) -> Result<(), String> {
    if room_id.len() < 3 || room_id.len() > 20 {
        return Err("房间 ID 长度需在 3-20 个字符之间".to_string());
    }
    if !room_id.chars().all(|c| c.is_ascii_alphanumeric() || c == '_' || c == '-') {
        return Err("房间 ID 仅支持字母、数字、下划线和连字符".to_string());
    }
    Ok(())
}

#[tauri::command]
pub async fn start_tunnel(
    app: AppHandle,
    state: State<'_, AppState>,
    request: StartTunnelRequest,
) -> Result<StartTunnelResponse, String> {
    // Validate room_id on the server side
    if let Err(e) = validate_room_id(&request.room_id) {
        log::warn!("Invalid room_id: {}", e);
        return Ok(StartTunnelResponse {
            success: false,
            hostname: None,
            error: Some(e),
        });
    }

    log::info!("Starting tunnel for room: {}, port: {}", request.room_id, request.local_port);
    let _ = app.emit("log://entry", LogEntryPayload::info(
        "tunnel",
        format!("开始启动隧道: 房间={}, 端口={}", request.room_id, request.local_port),
    ));

    // 1. Check if port is available
    if !is_port_available(request.local_port) {
        let msg = format!("端口 {} 已被占用", request.local_port);
        log::warn!("{}", msg);
        let _ = app.emit("log://entry", LogEntryPayload::warn("tunnel", &msg));
        return Ok(StartTunnelResponse {
            success: false,
            hostname: None,
            error: Some(format!("{}，请更换端口或关闭占用该端口的程序", msg)),
        });
    }

    // 2. Request token from Worker API
    let _ = app.emit("log://entry", LogEntryPayload::info("tunnel", "请求隧道令牌…"));
    let api_client = &state.api_client;
    let token_response = match api_client.request_token(&request.room_id).await {
        Ok(resp) => resp,
        Err(e) => {
            log::error!("Token request failed: {}", e);
            let _ = app.emit("log://entry",
                LogEntryPayload::error("tunnel", &e).with_data("API 请求失败"));
            return Ok(StartTunnelResponse {
                success: false,
                hostname: None,
                error: Some(e),
            });
        }
    };

    if !token_response.success {
        let err_msg = token_response.error.unwrap_or_else(|| "获取隧道令牌失败".to_string());
        log::error!("Token response error: {}", err_msg);
        let _ = app.emit("log://entry",
            LogEntryPayload::error("tunnel", &err_msg));
        return Ok(StartTunnelResponse {
            success: false,
            hostname: None,
            error: Some(err_msg),
        });
    }

    let token_data = match token_response.data {
        Some(data) => data,
        None => {
            let msg = "响应数据异常：缺少令牌信息";
            log::error!("{}", msg);
            let _ = app.emit("log://entry", LogEntryPayload::error("tunnel", msg));
            return Ok(StartTunnelResponse {
                success: false,
                hostname: None,
                error: Some(msg.to_string()),
            });
        }
    };

    let hostname = token_data.hostname.clone();

    // 3. Store hostname in state
    *state.current_hostname.lock().await = Some(hostname.clone());

    // 4. Start cloudflared tunnel via sidecar
    let _ = app.emit("log://entry",
        LogEntryPayload::info("tunnel", format!("启动 cloudflared 侧进程…")));
    let tunnel_manager = &state.tunnel_manager;
    if let Err(e) = tunnel_manager.start_with_token(&app, &token_data.token).await {
        *state.current_hostname.lock().await = None;
        log::error!("Failed to start tunnel: {}", e);
        let _ = app.emit("log://entry",
            LogEntryPayload::error("tunnel", &e));
        return Ok(StartTunnelResponse {
            success: false,
            hostname: None,
            error: Some(e),
        });
    }

    log::info!("Tunnel started successfully: {}", hostname);
    let _ = app.emit("log://entry",
        LogEntryPayload::info("tunnel", format!("隧道已启动: {}", hostname)));

    Ok(StartTunnelResponse {
        success: true,
        hostname: Some(hostname),
        error: None,
    })
}

#[tauri::command]
pub async fn stop_tunnel(app: AppHandle, state: State<'_, AppState>) -> Result<(), String> {
    log::info!("Stopping tunnel");
    let _ = app.emit("log://entry", LogEntryPayload::info("tunnel", "正在停止隧道…"));

    let tunnel_manager = &state.tunnel_manager;
    tunnel_manager.stop(&app).await?;

    *state.current_hostname.lock().await = None;

    log::info!("Tunnel stopped");
    let _ = app.emit("log://entry", LogEntryPayload::info("tunnel", "隧道已停止"));
    Ok(())
}
