import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Play, Square, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store';
import { startTunnel, stopTunnel, checkCloudflared } from '../services/tauri';
import {
  buildHostname,
  sanitizeRoomId,
  validatePort,
  validateRoomId,
} from '../lib/validation';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CopyField } from '../components/ui/CopyField';
import { logger } from '../lib/logger';
import { useI18n } from '../i18n';

export function HostPage() {
  const tunnelStatus = useAppStore((s) => s.tunnelStatus);
  const hostname = useAppStore((s) => s.hostname);
  const error = useAppStore((s) => s.error);
  const localPort = useAppStore((s) => s.localPort);
  const cloudflaredReady = useAppStore((s) => s.cloudflaredReady);
  const setTunnelStatus = useAppStore((s) => s.setTunnelStatus);
  const setHostname = useAppStore((s) => s.setHostname);
  const setError = useAppStore((s) => s.setError);
  const setLocalPort = useAppStore((s) => s.setLocalPort);
  const resetTunnel = useAppStore((s) => s.resetTunnel);
  const setCloudflaredReady = useAppStore((s) => s.setCloudflaredReady);
  const { t } = useI18n();

  const [roomId, setRoomId] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    roomId?: string | null;
    port?: string | null;
  }>({});

  const busy = tunnelStatus === 'running' || tunnelStatus === 'connecting';
  const preview = useMemo(
    () => (roomId.trim().length >= 3 ? buildHostname(roomId) : null),
    [roomId],
  );

  // 启动时检测 sidecar cloudflared 是否可用
  useEffect(() => {
    let dead = false;
    checkCloudflared().then((ok) => {
      if (!dead) setCloudflaredReady(ok);
    }).catch(() => {
      // Tauri 环境不可用时静默处理
    });
    return () => {
      dead = true;
    };
  }, [setCloudflaredReady]);

  const handleStart = useCallback(async () => {
    const roomErrKey = validateRoomId(roomId);
    const portErrKey = validatePort(localPort);
    const roomErr = roomErrKey ? t(roomErrKey as any) : null;
    const portErr = portErrKey ? t(portErrKey as any) : null;
    setFieldErrors({ roomId: roomErr, port: portErr });
    if (roomErr || portErr) {
      logger.warn('app', '表单验证失败', { roomId, localPort, roomErr, portErr });
      setError(roomErr || portErr);
      return;
    }
    logger.info('app', '用户点击启动隧道', { roomId: roomId.trim(), localPort });
    setTunnelStatus('connecting');
    setError(null);
    try {
      const res = await startTunnel(roomId.trim(), localPort);
      if (res.success && res.hostname) {
        setHostname(res.hostname);
        setTunnelStatus('running');
      } else {
        setError(res.error || t('host.startFailed'));
        setTunnelStatus('error');
      }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : t('host.unknownError');
      logger.error('app', '启动隧道异常', { error: errMsg });
      setError(errMsg);
      setTunnelStatus('error');
    }
  }, [roomId, localPort, setTunnelStatus, setHostname, setError, t]);

  const handleStop = useCallback(async () => {
    logger.info('app', '用户点击停止隧道');
    try {
      const res = await stopTunnel();
      if (!res.success) {
        setError(res.error || t('host.stopFailed'));
        return;
      }
      resetTunnel();
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : t('host.stopFailed');
      logger.error('app', '停止隧道异常', { error: errMsg });
      setError(errMsg);
    }
  }, [resetTunnel, setError, t]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (tunnelStatus === 'running') void handleStop();
    else if (tunnelStatus !== 'connecting') void handleStart();
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <header className="mb-6">
        <p
          className="text-2xs font-medium uppercase tracking-[0.16em]"
          style={{ color: 'var(--green)' }}
        >
          Host mode
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">{t('host.title')}</h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--mute)' }}>
          {t('host.subtitle')}
        </p>
      </header>

      {/* cloudflared 状态栏 */}
      <section className="surface mb-4 p-4">
        <div className="flex items-center gap-2">
          {cloudflaredReady === null ? (
            <Loader2 size={16} className="animate-spin shrink-0" style={{ color: 'var(--mute)' }} />
          ) : cloudflaredReady ? (
            <CheckCircle2 size={16} className="shrink-0" style={{ color: 'var(--green)' }} />
          ) : (
            <AlertCircle size={16} className="shrink-0" style={{ color: 'var(--danger)' }} />
          )}
          <span className="text-sm" style={{ color: 'var(--mute)' }}>
            {cloudflaredReady === null
              ? t('host.cloudflared.checking')
              : cloudflaredReady
                ? t('host.cloudflared.ready')
                : t('host.cloudflared.unavailable')}
          </span>
        </div>
      </section>

      <form onSubmit={onSubmit} className="surface p-5 space-y-4">
        <Input
          name="roomId"
          label={t('host.roomId')}
          value={roomId}
          onChange={(e) => {
            const v = sanitizeRoomId(e.target.value);
            setRoomId(v);
            setFieldErrors((f) => ({
              ...f,
              roomId: v ? (validateRoomId(v) ? t(validateRoomId(v) as any) : null) : null,
            }));
          }}
          placeholder="my-room"
          disabled={busy}
          maxLength={20}
          autoComplete="off"
          spellCheck={false}
          error={fieldErrors.roomId}
          hint={t('host.roomIdHint')}
        />

        {preview && !busy && (
          <div
            className="rounded-lg border border-dashed px-3 py-2 text-2xs"
            style={{
              borderColor: 'var(--line)',
              background: 'var(--green-soft)',
              color: 'var(--mute)',
            }}
          >
            {t('host.preview')}{' '}
            <code className="mono" style={{ color: 'var(--green)' }}>
              {preview}
            </code>
          </div>
        )}

        <Input
          name="localPort"
          label={t('host.port')}
          type="number"
          value={localPort || ''}
          onChange={(e) => {
            const p = parseInt(e.target.value, 10);
            if (Number.isNaN(p)) {
              setLocalPort(0);
              setFieldErrors((f) => ({ ...f, port: t('host.invalidPort') }));
              return;
            }
            setLocalPort(p);
            const portErrKey = validatePort(p);
            setFieldErrors((f) => ({ ...f, port: portErrKey ? t(portErrKey as any) : null }));
          }}
          disabled={busy}
          min={1}
          max={65535}
          error={fieldErrors.port}
          hint={t('host.portHint')}
        />

        <div className="pt-1">
          {tunnelStatus === 'running' ? (
            <Button type="submit" variant="danger" fullWidth>
              <Square size={15} />
              {t('host.stop')}
            </Button>
          ) : (
            <Button
              type="submit"
              variant="solid"
              fullWidth
              loading={tunnelStatus === 'connecting'}
              disabled={
                !!fieldErrors.roomId ||
                !!fieldErrors.port ||
                cloudflaredReady !== true
              }
            >
              {tunnelStatus === 'connecting' ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {t('host.starting')}
                </>
              ) : (
                <>
                  <Play size={15} />
                  {t('host.start')}
                </>
              )}
            </Button>
          )}
        </div>
      </form>

      {tunnelStatus === 'running' && hostname && (
        <section
          className="surface mt-4 p-5"
          style={{
            borderColor: 'color-mix(in srgb, var(--green) 35%, var(--line))',
            background: 'color-mix(in srgb, var(--green) 6%, transparent)',
          }}
        >
          <p
            className="text-2xs uppercase tracking-wider"
            style={{ color: 'var(--green)' }}
          >
            Live
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--mute)' }}>
            {t('host.share')}
          </p>
          <div className="mt-3">
            <CopyField value={hostname} />
          </div>
          <p className="mt-3 text-2xs" style={{ color: 'var(--mute)' }}>
            {t('host.portInstruction', { port: localPort })}
          </p>
        </section>
      )}

      {tunnelStatus === 'error' && error && (
        <section
          className="mt-4 rounded-xl border p-4"
          style={{
            borderColor: 'color-mix(in srgb, var(--danger) 30%, transparent)',
            background: 'color-mix(in srgb, var(--danger) 8%, transparent)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--danger)' }}>
            {error}
          </p>
        </section>
      )}

      <ol
        className="mt-6 space-y-2 border-t pt-5 text-2xs"
        style={{ borderColor: 'var(--line)', color: 'var(--mute)' }}
      >
        <li>{t('host.steps.1')}</li>
        <li>{t('host.steps.2')}</li>
        <li>{t('host.steps.3')}</li>
      </ol>
    </div>
  );
}
