use tauri::AppHandle;
use crate::models::SpeedTestResult;
use crate::services::speed_test;
use crate::services::hosts_manager;

#[tauri::command]
pub async fn run_speed_test(app: AppHandle) -> Result<SpeedTestResult, String> {
    log::info!("Starting speed test");
    let result = speed_test::run_speed_test(&app).await?;
    log::info!("Speed test result: {} ({}ms, {}% loss)",
        result.ip, result.latency_ms, result.loss_percent);
    Ok(result)
}

#[tauri::command]
pub async fn apply_speed_optimization(ip: String) -> Result<(), String> {
    log::info!("Applying speed optimization: {}", ip);
    hosts_manager::apply_optimization(&ip)?;
    Ok(())
}

#[tauri::command]
pub async fn remove_speed_optimization() -> Result<(), String> {
    log::info!("Removing speed optimization");
    hosts_manager::remove_optimization()?;
    Ok(())
}

#[tauri::command]
pub fn get_speed_status() -> crate::models::SpeedStatus {
    let current_ip = hosts_manager::get_current_ip();
    crate::models::SpeedStatus {
        enabled: current_ip.is_some(),
        current_ip,
    }
}
