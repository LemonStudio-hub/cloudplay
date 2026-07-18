import { memo, useCallback, useSyncExternalStore, useState, useRef, useEffect } from 'react';
import {
  Settings,
  Trash2,
  Download,
  Search,
  ChevronDown,
  ChevronRight,
  FileText,
  Zap,
  ZapOff,
  Loader2,
  Gauge,
  Globe,
} from 'lucide-react';
import {
  logger,
  filterEntries,
  formatTimestamp,
  LEVEL_LABELS,
  getCategoryLabel,
} from '../lib/logger';
import type { LogLevel, LogCategory, LogEntry } from '../lib/logger';
import {
  runSpeedTest,
  applySpeedOptimization,
  removeSpeedOptimization,
  getSpeedStatus,
} from '../services/tauri';
import type { SpeedTestResult } from '../services/tauri';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/cn';
import { useI18n, setLocale } from '../i18n';
import type { Locale } from '../i18n';
import { STORAGE_KEYS } from '../lib/constants';

/* ── 级别颜色 ── */

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: 'var(--mute)',
  info: 'var(--info)',
  warn: 'var(--warn)',
  error: 'var(--danger)',
};

const LEVEL_BG: Record<LogLevel, string> = {
  debug: 'color-mix(in srgb, var(--mute) 12%, transparent)',
  info: 'color-mix(in srgb, var(--info) 12%, transparent)',
  warn: 'color-mix(in srgb, var(--warn) 12%, transparent)',
  error: 'color-mix(in srgb, var(--danger) 12%, transparent)',
};

/* ── 日志条目行 ── */

const LogRow = memo(function LogRow({ entry }: { entry: LogEntry }) {
  const [expanded, setExpanded] = useState(false);
  const hasData = entry.data !== undefined;
  const { t } = useI18n();

  return (
    <div
      className="border-b transition-colors"
      style={{
        borderColor: 'color-mix(in srgb, var(--line) 50%, transparent)',
      }}
    >
      <div
        className={cn(
          'flex items-start gap-2 px-3 py-1.5 text-xs',
          hasData && 'cursor-pointer hover:bg-[color-mix(in_srgb,var(--ink)_2%,transparent)]',
        )}
        onClick={() => hasData && setExpanded(!expanded)}
      >
        <span className="mt-0.5 w-3 shrink-0" style={{ color: 'var(--mute)' }}>
          {hasData && (
            expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          )}
        </span>

        <span
          className="mono shrink-0 tabular-nums select-all"
          style={{ color: 'var(--mute)', fontSize: '11px' }}
        >
          {formatTimestamp(entry.timestamp)}
        </span>

        <span
          className="shrink-0 rounded px-1 py-0.5 font-medium uppercase"
          style={{
            color: LEVEL_COLORS[entry.level],
            background: LEVEL_BG[entry.level],
            fontSize: '10px',
            letterSpacing: '0.04em',
          }}
        >
          {LEVEL_LABELS[entry.level]}
        </span>

        <span
          className="shrink-0 rounded px-1 py-0.5"
          style={{
            color: 'var(--mute)',
            background: 'color-mix(in srgb, var(--mute) 8%, transparent)',
            fontSize: '10px',
          }}
        >
          {getCategoryLabel(entry.category, t)}
        </span>

        <span
          className="min-w-0 flex-1 break-all"
          style={{ color: 'var(--ink)' }}
        >
          {entry.message}
        </span>
      </div>

      {expanded && hasData && (
        <div
          className="mono mx-6 mb-2 rounded-md px-3 py-2 text-xs"
          style={{
            background: 'var(--field-bg)',
            border: '1px solid var(--line)',
            color: 'var(--mute)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
        >
          {typeof entry.data === 'string'
            ? entry.data
            : JSON.stringify(entry.data, null, 2)}
        </div>
      )}
    </div>
  );
});

/* ── 语言选择器 ── */

const LanguageSelector = memo(function LanguageSelector() {
  const { locale, t } = useI18n();

  return (
    <section className="surface mb-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe size={16} style={{ color: 'var(--green)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
            {t('settings.language')}
          </span>
        </div>
        <select
          className="field py-1 text-xs"
          style={{ background: 'var(--field-bg)', minWidth: '100px' }}
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
      </div>
    </section>
  );
});

/* ── 速度优化区域 ── */

const SpeedOptimizationSection = memo(function SpeedOptimizationSection() {
  const { t, locale } = useI18n();
  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SPEED_ENABLED) !== 'false';
  });
  const [testing, setTesting] = useState(false);
  const [currentIp, setCurrentIp] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<SpeedTestResult | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SPEED_RESULT);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [lastTestTime, setLastTestTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SPEED_TIME);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let dead = false;
    getSpeedStatus().then((status) => {
      if (dead) return;
      setCurrentIp(status.currentIp);
      if (status.enabled && !enabled) {
        setEnabled(true);
        localStorage.setItem(STORAGE_KEYS.SPEED_ENABLED, 'true');
      }
    }).catch(() => {
      // Tauri 环境不可用时静默处理
    });
    return () => { dead = true; };
  }, []);

  const handleToggle = useCallback(async () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(STORAGE_KEYS.SPEED_ENABLED, String(next));

    if (next && lastResult) {
      try {
        await applySpeedOptimization(lastResult.ip);
        setCurrentIp(lastResult.ip);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : t('settings.applyFailed'));
        setEnabled(false);
        localStorage.setItem(STORAGE_KEYS.SPEED_ENABLED, 'false');
      }
    } else if (!next) {
      try {
        await removeSpeedOptimization();
        setCurrentIp(null);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : t('settings.removeFailed'));
      }
    }
  }, [enabled, lastResult, t]);

  const handleTest = useCallback(async () => {
    setTesting(true);
    setError(null);
    try {
      const result = await runSpeedTest();
      setLastResult(result);
      const now = Date.now();
      setLastTestTime(now);
      localStorage.setItem(STORAGE_KEYS.SPEED_RESULT, JSON.stringify(result));
      localStorage.setItem(STORAGE_KEYS.SPEED_TIME, String(now));

      if (enabled) {
        await applySpeedOptimization(result.ip);
        setCurrentIp(result.ip);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t('settings.testFailed'));
    } finally {
      setTesting(false);
    }
  }, [enabled, t]);

  const formatTime = useCallback((ts: number) => {
    if (!ts) return t('settings.never');
    return new Date(ts).toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [t, locale]);

  return (
    <section className="surface mb-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge size={16} style={{ color: 'var(--green)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
            {t('settings.speedOptimization')}
          </span>
        </div>
        <button
          type="button"
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
            enabled
              ? 'bg-[color-mix(in_srgb,var(--green)_40%,transparent)]'
              : 'bg-[color-mix(in_srgb,var(--mute)_20%,transparent)]',
          )}
          role="switch"
          aria-checked={enabled}
          onClick={handleToggle}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out',
              enabled ? 'translate-x-5' : 'translate-x-0',
            )}
            style={{
              background: enabled ? 'var(--green)' : 'var(--mute)',
            }}
          />
        </button>
      </div>

      <p className="mt-2 text-2xs" style={{ color: 'var(--mute)' }}>
        {t('settings.speedDesc')}
      </p>

      <div
        className="mt-3 rounded-lg border p-3"
        style={{
          borderColor: 'color-mix(in srgb, var(--line) 60%, transparent)',
          background: 'var(--field-bg)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {enabled ? (
              <Zap size={14} style={{ color: 'var(--green)' }} />
            ) : (
              <ZapOff size={14} style={{ color: 'var(--mute)' }} />
            )}
            <span className="text-xs" style={{ color: enabled ? 'var(--green)' : 'var(--mute)' }}>
              {enabled ? t('settings.enabled') : t('settings.disabled')}
            </span>
          </div>
          {currentIp && (
            <span
              className="mono rounded px-1.5 py-0.5 text-2xs"
              style={{
                color: 'var(--green)',
                background: 'var(--green-soft)',
              }}
            >
              {currentIp}
            </span>
          )}
        </div>

        {lastResult && (
          <div className="mt-2 flex gap-4 text-2xs" style={{ color: 'var(--mute)' }}>
            <span>{t('settings.latency')}: <b style={{ color: 'var(--ink)' }}>{lastResult.latencyMs.toFixed(1)}ms</b></span>
            <span>{t('settings.loss')}: <b style={{ color: lastResult.lossPercent > 5 ? 'var(--danger)' : 'var(--ink)' }}>{lastResult.lossPercent.toFixed(1)}%</b></span>
            <span>{t('settings.lastTest')}: {formatTime(lastTestTime)}</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button
          variant="solid"
          onClick={handleTest}
          loading={testing}
          disabled={testing}
        >
          {testing ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {t('settings.testing')}
            </>
          ) : (
            <>
              <Gauge size={14} />
              {t('settings.runTest')}
            </>
          )}
        </Button>
        <span className="text-2xs" style={{ color: 'var(--mute)' }}>
          {t('settings.testHint')}
        </span>
      </div>

      {error && (
        <p className="mt-2 text-2xs" style={{ color: 'var(--danger)' }}>
          {error}
        </p>
      )}
    </section>
  );
});

/* ── 主页面 ── */

export function SettingsPage() {
  const { t } = useI18n();
  const entries = useSyncExternalStore(
    logger.subscribe,
    logger.getSnapshot,
    logger.getSnapshot,
  );

  const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<LogCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const filtered = filterEntries(entries, {
    level: levelFilter,
    category: categoryFilter,
    search,
  });

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filtered.length, autoScroll]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    setAutoScroll(atBottom);
  }, []);

  const handleExport = useCallback(() => {
    const text = logger.exportText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudplay-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(logger.exportText()).catch(() => {});
  }, []);

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col overflow-y-auto">
      {/* 页头 */}
      <header className="mb-4 shrink-0">
        <p
          className="text-2xs font-medium uppercase tracking-[0.16em]"
          style={{ color: 'var(--green)' }}
        >
          Settings
        </p>
        <div className="mt-1 flex items-center gap-2">
          <Settings size={18} style={{ color: 'var(--ink)' }} />
          <h2 className="text-xl font-semibold tracking-tight">{t('settings.title')}</h2>
        </div>
      </header>

      {/* 语言选择 */}
      <LanguageSelector />

      {/* 速度优化 */}
      <SpeedOptimizationSection />

      {/* 日志区 */}
      <section
        className="surface flex min-h-0 flex-1 flex-col overflow-hidden"
        style={{ background: 'color-mix(in srgb, var(--panel) 94%, transparent)' }}
      >
        {/* 工具栏 */}
        <div
          className="flex shrink-0 flex-wrap items-center gap-2 border-b px-4 py-3"
          style={{ borderColor: 'var(--line)' }}
        >
          <FileText size={14} style={{ color: 'var(--mute)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--ink)' }}>
            {t('settings.logs')}
          </span>
          <span
            className="mono rounded px-1.5 py-0.5 text-2xs"
            style={{
              color: 'var(--mute)',
              background: 'color-mix(in srgb, var(--mute) 8%, transparent)',
            }}
          >
            {filtered.length}/{entries.length}
          </span>

          <div className="flex-1" />

          <Button variant="ghost" onClick={handleCopy}>
            <Download size={13} />
            {t('settings.copy')}
          </Button>
          <Button variant="ghost" onClick={handleExport}>
            <Download size={13} />
            {t('settings.export')}
          </Button>
          <Button variant="danger" onClick={() => logger.clear()}>
            <Trash2 size={13} />
            {t('settings.clear')}
          </Button>
        </div>

        {/* 筛选栏 */}
        <div
          className="flex shrink-0 flex-wrap items-center gap-2 border-b px-4 py-2"
          style={{ borderColor: 'color-mix(in srgb, var(--line) 50%, transparent)' }}
        >
          <div className="relative flex-1 min-w-[140px]">
            <Search
              size={13}
              className="absolute left-2 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--mute)' }}
            />
            <input
              className="field w-full py-1 pl-7 pr-2 text-xs"
              style={{ background: 'var(--field-bg)' }}
              placeholder={t('settings.searchLogs')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="field py-1 text-xs"
            style={{ background: 'var(--field-bg)', minWidth: '72px' }}
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as LogLevel | 'all')}
          >
            <option value="all">{t('settings.allLevels')}</option>
            <option value="error">ERROR</option>
            <option value="warn">WARN</option>
            <option value="info">INFO</option>
            <option value="debug">DEBUG</option>
          </select>

          <select
            className="field py-1 text-xs"
            style={{ background: 'var(--field-bg)', minWidth: '72px' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as LogCategory | 'all')}
          >
            <option value="all">{t('settings.allCategories')}</option>
            <option value="app">{t('log.app')}</option>
            <option value="tunnel">{t('log.tunnel')}</option>
            <option value="api">{t('log.api')}</option>
            <option value="system">{t('log.system')}</option>
          </select>
        </div>

        {/* 日志列表 */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto"
          onScroll={handleScroll}
        >
          {filtered.length === 0 ? (
            <div
              className="flex h-full items-center justify-center py-16 text-sm"
              style={{ color: 'var(--mute)' }}
            >
              {entries.length === 0
                ? t('settings.noLogs')
                : t('settings.noMatch')}
            </div>
          ) : (
            filtered.map((entry) => <LogRow key={entry.id} entry={entry} />)
          )}
        </div>

        {/* 底栏 */}
        <div
          className="flex shrink-0 items-center justify-between border-t px-4 py-2 text-2xs"
          style={{
            borderColor: 'color-mix(in srgb, var(--line) 50%, transparent)',
            color: 'var(--mute)',
          }}
        >
          <span>
            {t('settings.retention')}
          </span>
          <button
            className="text-2xs underline-offset-2 hover:underline"
            style={{ color: 'var(--green)' }}
            onClick={() => setAutoScroll(true)}
          >
            {autoScroll ? t('settings.autoScroll') : t('settings.enableAutoScroll')}
          </button>
        </div>
      </section>
    </div>
  );
}
