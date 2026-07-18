use std::time::Duration;
use crate::models::TokenResponse;
use reqwest::Client;

pub struct ApiClient {
    base_url: String,
    client: Client,
}

impl ApiClient {
    pub fn new(base_url: String) -> Result<Self, String> {
        let client = Client::builder()
            .timeout(Duration::from_secs(15))
            .build()
            .map_err(|e| {
                log::error!("Failed to create HTTP client: {}", e);
                format!("创建 HTTP 客户端失败: {}", e)
            })?;
        Ok(Self {
            base_url,
            client,
        })
    }

    /// Create a client with default settings (used as fallback when `new` fails).
    pub fn new_force(base_url: String) -> Self {
        Self {
            base_url,
            client: Client::new(),
        }
    }

    /// Request a tunnel token from the Worker API
    pub async fn request_token(&self, room_id: &str) -> Result<TokenResponse, String> {
        let url = format!("{}/api/token", self.base_url);

        let response = self.client
            .post(&url)
            .json(&serde_json::json!({ "roomId": room_id }))
            .send()
            .await
            .map_err(|e| {
                if e.is_timeout() {
                    "请求超时，请检查网络连接".to_string()
                } else {
                    format!("网络错误: {}", e)
                }
            })?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_default();
            log::error!("API error ({}): {}", status, error_text);
            return Err(format!("API 错误 ({}): {}", status, error_text));
        }

        let token_response: TokenResponse = response.json().await
            .map_err(|e| format!("解析响应失败: {}", e))?;

        Ok(token_response)
    }

    /// Check API health
    #[allow(dead_code)]
    pub async fn health_check(&self) -> bool {
        let url = format!("{}/api/health", self.base_url);

        match self.client.get(&url).send().await {
            Ok(resp) => resp.status().is_success(),
            Err(_) => false,
        }
    }
}
