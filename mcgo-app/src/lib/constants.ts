/** Centralized constants — single source of truth for magic values. */

// ── Network defaults ──
export const DEFAULT_LOCAL_PORT = 25565;
export const DEFAULT_CLIENT_PORT = 25566;
export const DOMAIN = 'cloudplay.lat';

// ── localStorage keys ──
export const STORAGE_KEYS = {
  THEME: 'cloudplay-theme',
  LOCALE: 'cloudplay-locale',
  SPEED_ENABLED: 'cloudplay-speed-enabled',
  SPEED_RESULT: 'cloudplay-speed-result',
  SPEED_TIME: 'cloudplay-speed-time',
} as const;

// ── Timeouts & intervals (ms) ──
export const HEALTH_CHECK_INTERVAL = 30_000;
export const API_TOKEN_TIMEOUT = 12_000;
export const API_HEALTH_TIMEOUT = 4_000;

// ── Logger ──
export const MAX_LOG_ENTRIES = 500;
