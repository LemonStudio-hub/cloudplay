import { memo, useCallback, useEffect, type ReactNode } from 'react';
import { Server, Users, Settings as SettingsIcon } from 'lucide-react';
import { useAppStore } from '../store';
import { AppMode } from '../types';
import { Logo } from './Logo';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import { healthCheck } from '../services/api';
import { cn } from '../lib/cn';

export const Sidebar = memo(function Sidebar() {
  const mode = useAppStore((s) => s.mode);
  const tunnelStatus = useAppStore((s) => s.tunnelStatus);
  const hostname = useAppStore((s) => s.hostname);
  const localPort = useAppStore((s) => s.localPort);
  const clientPort = useAppStore((s) => s.clientPort);
  const apiOnline = useAppStore((s) => s.apiOnline);
  const setMode = useAppStore((s) => s.setMode);
  const resetTunnel = useAppStore((s) => s.resetTunnel);
  const setApiOnline = useAppStore((s) => s.setApiOnline);
  const { theme, toggle } = useTheme();
  const { t } = useI18n();

  useEffect(() => {
    let dead = false;
    const tick = async () => {
      const ok = await healthCheck();
      if (!dead) setApiOnline(ok);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => {
      dead = true;
      window.clearInterval(id);
    };
  }, [setApiOnline]);

  const switchMode = useCallback(
    (next: AppMode) => {
      if (next === mode) return;
      if (next !== 'settings' && (tunnelStatus === 'running' || tunnelStatus === 'connecting')) {
        if (!window.confirm(t('sidebar.switchConfirm'))) return;
        resetTunnel();
      }
      setMode(next);
    },
    [mode, tunnelStatus, resetTunnel, setMode, t],
  );

  const statusColor =
    tunnelStatus === 'running'
      ? 'var(--green)'
      : tunnelStatus === 'connecting'
        ? 'var(--warn)'
        : tunnelStatus === 'error'
          ? 'var(--danger)'
          : 'var(--mute)';

  const port = mode === 'host' ? localPort : mode === 'client' ? clientPort : null;

  const statusLabel =
    tunnelStatus === 'idle'
      ? t('sidebar.status.idle')
      : tunnelStatus === 'connecting'
        ? t('sidebar.status.connecting')
        : tunnelStatus === 'running'
          ? t('sidebar.status.running')
          : t('sidebar.status.error');

  return (
    <aside className="shell__aside">
      <div
        className="shell__brand flex items-center gap-2.5 min-w-0"
        data-tauri-drag-region
      >
        <Logo size={28} />
        <div className="min-w-0 max-sm:hidden" data-tauri-drag-region>
          <div className="text-sm font-semibold tracking-tight" data-tauri-drag-region>
            {t('app.name')}
          </div>
          <div className="text-2xs" style={{ color: 'var(--mute)' }} data-tauri-drag-region>
            {t('app.subtitle')}
          </div>
        </div>
      </div>

      <nav
        className="flex flex-1 flex-col px-3 max-sm:flex-none max-sm:px-0"
        aria-label={t('a11y.mode')}
      >
        <div className="mode-nav" data-mode={mode}>
          <span className="mode-nav__pill" aria-hidden />
          <ModeButton
            active={mode === 'host'}
            onClick={() => switchMode('host')}
            icon={<Server size={15} strokeWidth={1.75} />}
            title={t('sidebar.host')}
            desc={t('sidebar.hostDesc')}
          />
          <ModeButton
            active={mode === 'client'}
            onClick={() => switchMode('client')}
            icon={<Users size={15} strokeWidth={1.75} />}
            title={t('sidebar.client')}
            desc={t('sidebar.clientDesc')}
          />
        </div>

        {/* 设置入口 */}
        <div className="mt-2 px-1 max-sm:mt-0">
          <button
            type="button"
            onClick={() => switchMode('settings')}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors',
              'max-sm:px-2 max-sm:py-1.5',
              mode === 'settings'
                ? 'text-[var(--ink)] bg-[color-mix(in_srgb,var(--green)_9%,transparent)]'
                : 'text-[var(--mute)] hover:text-[color-mix(in_srgb,var(--ink)_82%,var(--mute))] hover:bg-[color-mix(in_srgb,var(--ink)_3.5%,transparent)]',
            )}
          >
            <SettingsIcon size={15} strokeWidth={1.75} />
            <span className="max-sm:hidden">{t('sidebar.settings')}</span>
          </button>
        </div>
      </nav>

      <div
        className="shell__foot mt-auto px-3 py-3 max-sm:mt-0 max-sm:px-0 max-sm:py-0 max-sm:flex max-sm:items-center max-sm:gap-2"
      >
        <div className="mb-2.5 flex items-center max-sm:mb-0 max-sm:contents">
          <button
            type="button"
            className="theme-switch"
            data-mode={theme}
            role="switch"
            aria-checked={theme === 'light'}
            onClick={toggle}
            aria-label={theme === 'dark' ? t('a11y.switchLight') : t('a11y.switchDark')}
          >
            <span className="theme-switch__track">
              <span className="theme-switch__icon theme-switch__icon--sun" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                  <circle cx="12" cy="12" r="3.25" />
                  <path d="M12 3.5v1.5M12 19v1.5M3.5 12H5M19 12h1.5M6.05 6.05l1.06 1.06M16.89 16.89l1.06 1.06M6.05 17.95l1.06-1.06M16.89 7.11l1.06-1.06" />
                </svg>
              </span>
              <span className="theme-switch__icon theme-switch__icon--moon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.5 14.2A8 8 0 0 1 9.8 3.5 8.2 8.2 0 1 0 20.5 14.2z" />
                </svg>
              </span>
              <span className="theme-switch__thumb" aria-hidden />
            </span>
          </button>
        </div>

        <div className="space-y-1 max-sm:hidden">
          <div className="flex items-center gap-2 text-2xs" style={{ color: 'var(--mute)' }}>
            <span
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full',
                tunnelStatus === 'running' && 'animate-pulse',
              )}
              style={{ background: statusColor }}
            />
            <span style={{ color: statusColor }}>
              {statusLabel}
            </span>
            <span style={{ opacity: 0.35 }}>·</span>
            <span>
              API{' '}
              <span
                style={{
                  color:
                    apiOnline === null
                      ? 'var(--mute)'
                      : apiOnline
                        ? 'var(--green)'
                        : 'var(--danger)',
                }}
              >
                {apiOnline === null ? '…' : apiOnline ? 'OK' : 'DOWN'}
              </span>
            </span>
          </div>
          <div className="truncate text-2xs tabular-nums" style={{ color: 'var(--mute)' }}>
            {mode === 'settings' ? 'SETTINGS' : mode === 'host' ? 'HOST' : 'JOIN'}
            {port !== null && (
              <>
                {' '}· :{port}
              </>
            )}
            {hostname ? (
              <span className="ml-1" style={{ color: 'var(--green)' }}>
                {hostname}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
});

function ModeButton({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'mode-btn flex items-center gap-3 rounded-lg px-3 py-2.5 text-left',
        'max-sm:px-2.5 max-sm:py-2',
        active && 'mode-btn--active',
      )}
    >
      <span className="mode-btn__icon flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
        {icon}
      </span>
      <span className="min-w-0 max-sm:hidden">
        <span className="block text-sm font-medium">{title}</span>
        <span className="mode-btn__desc block text-2xs">{desc}</span>
      </span>
    </button>
  );
}
