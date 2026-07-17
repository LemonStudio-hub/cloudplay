import { TokenResponse } from '../types';
import { logger } from '../lib/logger';
import { t } from '../i18n';

const PROD_API = 'https://api.cloudplay.lat';
const DEV_API = 'http://127.0.0.1:8787';

function resolveApiBase(): string {
  // Prefer explicit override, then local worker in dev, else production.
  const envBase = (import.meta as ImportMeta & { env?: Record<string, string> })
    .env?.VITE_API_BASE;
  if (envBase) return envBase.replace(/\/$/, '');

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return DEV_API;
    }
  }
  return PROD_API;
}

const API_BASE_URL = resolveApiBase();

async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function requestToken(roomId: string): Promise<TokenResponse> {
  logger.info('api', '请求隧道令牌', { roomId, apiBase: API_BASE_URL });
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12_000);

    const response = await fetch(`${API_BASE_URL}/api/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response.ok) {
      const errorData = await parseJsonSafe(response);
      const errMsg = errorData?.error || `HTTP ${response.status}`;
      logger.error('api', '令牌请求失败', { status: response.status, error: errMsg });
      return { success: false, error: errMsg };
    }

    const result: TokenResponse = await response.json();
    if (result.success) {
      logger.info('api', '令牌获取成功', { hostname: result.data?.hostname });
    } else {
      logger.warn('api', '令牌返回失败', { error: result.error });
    }
    return result;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      logger.warn('api', '令牌请求超时', { roomId });
      return { success: false, error: t('api.timeout') };
    }
    const errMsg = error instanceof Error ? error.message : 'Network error';
    logger.error('api', '令牌请求异常', { error: errMsg });
    return { success: false, error: errMsg };
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4_000);
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timer);
    if (!response.ok) {
      logger.warn('api', '健康检查失败', { status: response.status });
    }
    return response.ok;
  } catch (error) {
    logger.debug('api', '健康检查网络异常', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

export { API_BASE_URL };
