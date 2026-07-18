import { logger } from '../lib/logger';
import { API_HEALTH_TIMEOUT } from '../lib/constants';

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

export const API_BASE_URL = resolveApiBase();

export async function healthCheck(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), API_HEALTH_TIMEOUT);
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
