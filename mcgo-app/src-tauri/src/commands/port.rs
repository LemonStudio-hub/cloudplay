use crate::services::port_scanner::is_port_available;

#[tauri::command]
pub async fn check_port(port: u16) -> Result<bool, String> {
    Ok(is_port_available(port))
}
