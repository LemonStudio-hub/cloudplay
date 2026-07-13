import { memo, useCallback, type ReactNode } from 'react';
import { Server, Users } from 'lucide-react';
import { useAppStore } from '../store';
import { AppMode } from '../types';
import { Logo } from './Logo';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/cn';

export const Sidebar = memo(function Sidebar() {
  const mode = useAppStore((s) => s.mode);
  const tunnelStatus = useAppStore((s) => s.tunnelStatus);
  const setMode = useAppStore((s) => s.setMode);
  const resetTunnel = useAppStore((s) => s.resetTunnel);
  const { theme, toggle } = useTheme();

  const switchMode = useCallback(
    (next: AppMode) => {
      if (next === mode) return;
      if (tunnelStatus === 'running' || tunnelStatus === 'connecting') {
        if (!window.confirm('切换模式将停止当前会话，是否继续？')) return;
      }
      resetTunnel();
      setMode(next);
    },
    [mode, tunnelStatus, resetTunnel, setMode],
  );

  return (
    <aside className="shell__aside">
      <div className="flex items-center gap-2.5 px-4 py-5 max-sm:py-0 max-sm:px-0 max-sm:shrink-0">
        <Logo size={28} />
        <div className="min-w-0 max-sm:hidden">
          <div className="text-sm font-semibold tracking-tight">CloudPlay</div>
          <div className="text-2xs" style={{ color: 'var(--mute)' }}>
            云玩
          </div>
        </div>
      </div>

      <nav
        className="flex flex-1 flex-col gap-1 px-3 max-sm:flex-row max-sm:flex-none max-sm:px-0"
        aria-label="模式"
      >
        <ModeButton
          active={mode === 'host'}
          onClick={() => switchMode('host')}
          icon={<Server size={15} strokeWidth={1.75} />}
          title="开服者"
          desc="创建隧道"
        />
        <ModeButton
          active={mode === 'client'}
          onClick={() => switchMode('client')}
          icon={<Users size={15} strokeWidth={1.75} />}
          title="联机者"
          desc="加入房间"
        />
      </nav>

      <div className="mt-auto flex items-center justify-between gap-2 border-t px-4 py-3 max-sm:mt-0 max-sm:border-0 max-sm:px-0 max-sm:py-0"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="hidden items-center gap-2 text-2xs sm:flex" style={{ color: 'var(--mute)' }}>
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              tunnelStatus === 'running' && 'animate-pulse',
            )}
            style={{
              background:
                tunnelStatus === 'running'
                  ? 'var(--green)'
                  : tunnelStatus === 'connecting'
                    ? 'var(--warn)'
                    : tunnelStatus === 'error'
                      ? 'var(--danger)'
                      : 'var(--mute)',
            }}
          />
          会话 ·{' '}
          {tunnelStatus === 'idle'
            ? '待命'
            : tunnelStatus === 'connecting'
              ? '连接中'
              : tunnelStatus === 'running'
                ? '运行中'
                : '异常'}
        </div>
        <button
          type="button"
          className="theme-switch"
          data-mode={theme}
          role="switch"
          aria-checked={theme === 'light'}
          onClick={toggle}
          aria-label={theme === 'dark' ? '切换浅色模式' : '切换深色模式'}
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
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
        'max-sm:px-2.5 max-sm:py-2',
      )}
      style={
        active
          ? {
              background: 'color-mix(in srgb, var(--green) 8%, transparent)',
              color: 'var(--ink)',
              boxShadow:
                'inset 0 0 0 1px color-mix(in srgb, var(--green) 35%, transparent)',
            }
          : { color: 'var(--mute)' }
      }
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border"
        style={
          active
            ? {
                borderColor: 'color-mix(in srgb, var(--green) 35%, var(--line))',
                background: 'var(--raised)',
                color: 'var(--green)',
              }
            : { borderColor: 'transparent' }
        }
      >
        {icon}
      </span>
      <span className="min-w-0 max-sm:hidden">
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-2xs" style={{ color: 'var(--mute)' }}>
          {desc}
        </span>
      </span>
    </button>
  );
}
