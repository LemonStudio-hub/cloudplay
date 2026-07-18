use tauri::AppHandle;
use tauri_plugin_shell::ShellExt;

/// 检查 sidecar cloudflared 是否可用
/// 通过尝试执行 `cloudflared version` 来验证
#[tauri::command]
pub async fn check_cloudflared(app: AppHandle) -> Result<bool, String> {
    let sidecar = app.shell()
        .sidecar("cloudflared")
        .map_err(|e| format!("加载 sidecar 失败: {}", e))?;

    match sidecar.args(["version"]).output().await {
        Ok(output) => Ok(output.status.success()),
        Err(e) => {
            log::warn!("cloudflared version check failed: {}", e);
            Ok(false)
        }
    }
}
