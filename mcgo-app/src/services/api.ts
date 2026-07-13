import { TokenResponse } from '../types';

const PROD_API = 'https://api.cloudplay.lat';
const DEV_API = 'http://127.0.0.1:8787';

function resolveApiBase(): string {
  // Prefer explicit override, then local worker in dev, else production.
  const envBase = (import.meta as ImportMeta & { env?: Record<string, string> })
    .env?.VITE_API_BASE;
  if (envBase) return envBase.replace(/\/$/, '');

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host === 'tauri.localhost') {
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
      return {
        success: false,
        error: errorData?.error || `HTTP ${response.status}`,
      };
    }

    return await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { success: false, error: '请求超时，请检查网络' };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
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
    return response.ok;
  } catch {
    return false;
  }
}

export { API_BASE_URL };
