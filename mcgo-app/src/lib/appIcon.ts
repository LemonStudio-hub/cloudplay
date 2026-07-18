import type { Theme } from '../hooks/useTheme';
import { EMBEDDED_ICONS } from './embeddedIcons';
import { isTauri } from './tauri';

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/**
 * Force Windows taskbar / window icon to the Cloudflare brand mark.
 * Uses embedded base64 PNG (no network/cache).
 */
export async function applyWindowIcon(theme: Theme): Promise<void> {
  if (!isTauri()) return;

  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    const { Image } = await import('@tauri-apps/api/image');

    const keys =
      theme === 'light'
        ? (['light_256', 'light_128'] as const)
        : (['dark_256', 'dark_128'] as const);

    let lastErr: unknown;
    for (const key of keys) {
      try {
        const bytes = b64ToBytes(EMBEDDED_ICONS[key]);
        const image = await Image.fromBytes(bytes);
        await getCurrentWindow().setIcon(image);
        return;
      } catch (e) {
        lastErr = e;
      }
    }
    console.warn('[icon] setIcon failed', lastErr);
  } catch (err) {
    console.warn('[icon] setIcon failed', err);
  }
}
