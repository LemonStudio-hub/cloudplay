/**
 * Check if the app is running inside a Tauri webview.
 * Shared utility — use this instead of duplicating the check.
 */
export function isTauri(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)
  );
}
