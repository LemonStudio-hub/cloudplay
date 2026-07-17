/**
 * CloudPlay 国际化 (i18n) 系统
 *
 * 轻量级方案，基于 useSyncExternalStore，与 useTheme 同模式。
 * 语言偏好持久化到 localStorage key 'cloudplay-locale'。
 */

import { useSyncExternalStore } from 'react';
import zh from './locales/zh';
import en from './locales/en';

export type Locale = 'zh' | 'en';

const STORAGE_KEY = 'cloudplay-locale';

const locales: Record<Locale, Record<string, string>> = { zh, en };

let currentLocale: Locale = 'zh';
const listeners = new Set<() => void>();

/* ── 内部工具 ── */

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && saved in locales) return saved;
  } catch {
    // SSR 或 localStorage 不可用
  }

  // 根据浏览器语言自动检测
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  return 'en';
}

function notify() {
  for (const fn of listeners) {
    try { fn(); } catch { /* ignore */ }
  }
}

/* ── 公开 API ── */

/** 初始化 i18n（在 main.tsx 中调用，同步执行，无闪烁） */
export function bootstrapI18n(): void {
  currentLocale = detectLocale();
}

/** 获取当前语言 */
export function getLocale(): Locale {
  return currentLocale;
}

/** 设置语言 */
export function setLocale(locale: Locale): void {
  if (locale === currentLocale) return;
  currentLocale = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  } catch {
    // ignore
  }
  notify();
}

/** 翻译函数（支持 {key} 插值） */
export function t(
  key: string,
  params?: Record<string, string | number>,
): string {
  let value = locales[currentLocale][key] ?? locales.zh[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(`{${k}}`, String(v));
    }
  }
  return value;
}

/** React Hook：返回当前 locale 和翻译函数 */
export function useI18n() {
  const locale = useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => { listeners.delete(onStoreChange); };
    },
    () => currentLocale,
    () => currentLocale,
  );

  return {
    locale,
    setLocale,
    t: (key: string, params?: Record<string, string | number>) => {
      let value = locales[locale][key] ?? locales.zh[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          value = value.replace(`{${k}}`, String(v));
        }
      }
      return value;
    },
  };
}
