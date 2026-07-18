/**
 * CloudPlay 前端日志系统
 *
 * 轻量级内存日志，不依赖 console，生产环境可用。
 * 环形缓冲区存储最近 500 条，支持按级别/分类筛选。
 */

import { MAX_LOG_ENTRIES } from './constants';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogCategory = 'app' | 'tunnel' | 'api' | 'system';

export interface LogEntry {
  id: number;
  timestamp: number;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: unknown;
}

type Listener = () => void;

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private _entries: LogEntry[] = [];
  private _nextId = 1;
  private _listeners = new Set<Listener>();

  /* ── 写入 ── */

  debug(category: LogCategory, message: string, data?: unknown): void {
    this._push('debug', category, message, data);
  }

  info(category: LogCategory, message: string, data?: unknown): void {
    this._push('info', category, message, data);
  }

  warn(category: LogCategory, message: string, data?: unknown): void {
    this._push('warn', category, message, data);
  }

  error(category: LogCategory, message: string, data?: unknown): void {
    this._push('error', category, message, data);
  }

  /* ── 读取 ── */

  getEntries(): readonly LogEntry[] {
    return this._entries;
  }

  getSnapshot(): LogEntry[] {
    return this._entries;
  }

  /* ── 操作 ── */

  clear(): void {
    this._entries = [];
    this._emit();
  }

  exportText(): string {
    return this._entries
      .map((e) => {
        const time = new Date(e.timestamp).toLocaleString('zh-CN');
        const level = e.level.toUpperCase().padEnd(5);
        const cat = `[${e.category}]`.padEnd(10);
        const dataStr = e.data !== undefined ? ` | ${JSON.stringify(e.data)}` : '';
        return `${time} ${level} ${cat} ${e.message}${dataStr}`;
      })
      .join('\n');
  }

  /* ── 订阅 ── */

  subscribe(listener: Listener): () => void {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }

  /* ── 内部 ── */

  private _push(
    level: LogLevel,
    category: LogCategory,
    message: string,
    data?: unknown,
  ): void {
    const entry: LogEntry = {
      id: this._nextId++,
      timestamp: Date.now(),
      level,
      category,
      message,
      data,
    };

    this._entries.push(entry);

    // 环形缓冲区：超出上限时淘汰最旧的
    if (this._entries.length > MAX_LOG_ENTRIES) {
      this._entries = this._entries.slice(-MAX_LOG_ENTRIES);
    }

    this._emit();
  }

  private _emit(): void {
    for (const listener of this._listeners) {
      try {
        listener();
      } catch {
        // listener 异常不应影响日志系统
      }
    }
  }
}

/** 全局单例 */
export const logger = new Logger();

/* ── 便捷筛选工具 ── */

export function filterEntries(
  entries: readonly LogEntry[],
  opts: {
    level?: LogLevel | 'all';
    category?: LogCategory | 'all';
    search?: string;
  } = {},
): LogEntry[] {
  const { level = 'all', category = 'all', search = '' } = opts;
  const q = search.trim().toLowerCase();

  return entries.filter((e) => {
    if (level !== 'all' && LEVEL_ORDER[e.level] < LEVEL_ORDER[level]) return false;
    if (category !== 'all' && e.category !== category) return false;
    if (q && !e.message.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  const ms = String(d.getMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss}.${ms}`;
}

export const LEVEL_LABELS: Record<LogLevel, string> = {
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
};

/** Get localized category label */
export function getCategoryLabel(
  category: LogCategory,
  t: (key: string) => string,
): string {
  const key = `log.${category}` as const;
  return t(key);
}
