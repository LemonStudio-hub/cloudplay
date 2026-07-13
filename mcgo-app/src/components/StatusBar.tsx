import { memo, useEffect } from 'react';
import { useAppStore } from '../store';
import { healthCheck } from '../services/api';

export const StatusBar = memo(function StatusBar() {
  const tunnelStatus = useAppStore((s) => s.tunnelStatus);
  const hostname = useAppStore((s) => s.hostname);
  const mode = useAppStore((s) => s.mode);
  const localPort = useAppStore((s) => s.localPort);
  const clientPort = useAppStore((s) => s.clientPort);
  const apiOnline = useAppStore((s) => s.apiOnline);
  const setApiOnline = useAppStore((s) => s.setApiOnline);

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

  const port = mode === 'host' ? localPort : clientPort;
  const statusColor =
    tunnelStatus === 'running'
      ? 'var(--green)'
      : tunnelStatus === 'connecting'
        ? 'var(--warn)'
        : tunnelStatus === 'error'
          ? 'var(--danger)'
          : 'var(--mute)';

  return (
    <footer className="shell__foot px-4 py-2">
      <div
        className="flex flex-wrap items-center justify-between gap-2 text-2xs"
        style={{ color: 'var(--mute)' }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: statusColor }}
            />
            <span style={{ color: statusColor }}>
              {tunnelStatus === 'idle'
                ? 'IDLE'
                : tunnelStatus === 'connecting'
                  ? 'CONNECTING'
                  : tunnelStatus === 'running'
                    ? 'LIVE'
                    : 'ERROR'}
            </span>
          </span>
          <span style={{ opacity: 0.4 }}>|</span>
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
          {hostname && (
            <>
              <span style={{ opacity: 0.4 }}>|</span>
              <code className="mono max-w-[160px] truncate" style={{ color: 'var(--green)' }}>
                {hostname}
              </code>
            </>
          )}
        </div>
        <span className="tabular-nums">
          {mode === 'host' ? 'HOST' : 'JOIN'} · :{port}
        </span>
      </div>
    </footer>
  );
});
