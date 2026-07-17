/**
 * Tauri 端日志事件监听器
 *
 * 监听 Rust 后端通过 `app.emit("log://entry", ...)` 推送的日志，
 * 转写入前端 logger 的 system 分类。
 */

import { listen } from '@tauri-apps/api/event';
import { logger } from './logger';
import type { LogLevel, LogCategory } from './logger';

interface RustLogPayload {
  level: string;
  category: string;
  message: string;
  data?: string | null;
}

let unlisten: (() => void) | null = null;

/**
 * 初始化 Tauri 日志监听。幂等——多次调用只注册一次。
 * 返回清理函数（通常不需要手动调用，应用生命周期内常驻即可）。
 */
export async function initTauriLogListener(): Promise<() => void> {
  if (unlisten) return unlisten;

  unlisten = await listen<RustLogPayload>('log://entry', (event) => {
    const { level, category, message, data } = event.payload;

    const validLevels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const validCategories: LogCategory[] = ['app', 'tunnel', 'api', 'system'];

    const lv: LogLevel = validLevels.includes(level as LogLevel)
      ? (level as LogLevel)
      : 'info';
    const cat: LogCategory = validCategories.includes(category as LogCategory)
      ? (category as LogCategory)
      : 'system';

    switch (lv) {
      case 'error':
        logger.error(cat, message, data ?? undefined);
        break;
      case 'warn':
        logger.warn(cat, message, data ?? undefined);
        break;
      case 'debug':
        logger.debug(cat, message, data ?? undefined);
        break;
      default:
        logger.info(cat, message, data ?? undefined);
    }
  });

  return unlisten;
}
