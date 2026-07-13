import { useCallback, useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';

const KEY = 'cloudplay-theme';
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
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => 'dark' as Theme,
  );

  const toggle = useCallback(() => {
    setGlobalTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setGlobalTheme(t);
  }, []);

  return { theme, toggle, setTheme };
}
