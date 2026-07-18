import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { applyWindowIcon } from '../lib/appIcon';
import { STORAGE_KEYS } from '../lib/constants';

export type Theme = 'dark' | 'light';

const KEY = STORAGE_KEYS.THEME;
const listeners = new Set<() => void>();

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(KEY) as Theme | null;
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

function apply(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

let current: Theme =
  typeof window !== 'undefined' ? readTheme() : 'dark';

if (typeof window !== 'undefined') {
  apply(current);
}

function setGlobalTheme(theme: Theme) {
  current = theme;
  apply(theme);
  localStorage.setItem(KEY, theme);
  listeners.forEach((l) => l());
  void applyWindowIcon(theme);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return current;
}

/** Call before first paint when possible */
export function bootstrapTheme() {
  const t = readTheme();
  current = t;
  apply(t);
  // Taskbar icon ASAP (exe default may be stale until this runs)
  void applyWindowIcon(t);
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => 'dark' as Theme,
  );

  // Apply matching taskbar icon once Tauri + assets are ready
  useEffect(() => {
    void applyWindowIcon(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setGlobalTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setGlobalTheme(t);
  }, []);

  return { theme, toggle, setTheme };
}
