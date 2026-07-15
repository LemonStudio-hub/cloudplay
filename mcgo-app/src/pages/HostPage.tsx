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
    });
    return () => {
      dead = true;
    };
  }, [setCloudflaredReady]);

  const handleStart = useCallback(async () => {
    const roomErr = validateRoomId(roomId);
    const portErr = validatePort(localPort);
    setFieldErrors({ roomId: roomErr, port: portErr });
    if (roomErr || portErr) {
      setError(roomErr || portErr);
      return;
    }
    setTunnelStatus('connecting');
    setError(null);
    try {
      const res = await startTunnel(roomId.trim(), localPort);
      if (res.success && res.hostname) {
        setHostname(res.hostname);
        setTunnelStatus('running');
      } else {
        setError(res.error || '启动失败');
        setTunnelStatus('error');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '未知错误');
      setTunnelStatus('error');
    }
  }, [roomId, localPort, setTunnelStatus, setHostname, setError]);

  const handleStop = useCallback(async () => {
    const res = await stopTunnel();
    if (!res.success) {
      setError(res.error || '停止失败');
      return;
    }
    resetTunnel();
  }, [resetTunnel, setError]);

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
        <h2 className="mt-1 text-xl font-semibold tracking-tight">开服</h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--mute)' }}>
          把本机游戏端口暴露为可分享地址
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
              ? '正在检测隧道组件…'
              : cloudflaredReady
                ? '隧道组件已就绪'
                : '隧道组件不可用，请重新安装应用'}
          </span>
        </div>
      </section>

      <form onSubmit={onSubmit} className="surface p-5 space-y-4">
        <Input
          name="roomId"
          label="房间 ID"
          value={roomId}
          onChange={(e) => {
            const v = sanitizeRoomId(e.target.value);
            setRoomId(v);
            setFieldErrors((f) => ({
              ...f,
              roomId: v ? validateRoomId(v) : null,
            }));
          }}
          placeholder="my-room"
          disabled={busy}
          maxLength={20}
          autoComplete="off"
          spellCheck={false}
          error={fieldErrors.roomId}
          hint="3–20 位字母数字、下划线、连字符"
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
            将生成{' '}
            <code className="mono" style={{ color: 'var(--green)' }}>
              {preview}
            </code>
          </div>
        )}

        <Input
          name="localPort"
          label="本地端口"
          type="number"
          value={localPort || ''}
          onChange={(e) => {
            const p = parseInt(e.target.value, 10);
            if (Number.isNaN(p)) {
              setLocalPort(0);
              setFieldErrors((f) => ({ ...f, port: '无效端口' }));
              return;
            }
            setLocalPort(p);
            setFieldErrors((f) => ({ ...f, port: validatePort(p) }));
          }}
          disabled={busy}
          min={1}
          max={65535}
          error={fieldErrors.port}
          hint="默认 25565"
        />

        <div className="pt-1">
          {tunnelStatus === 'running' ? (
            <Button type="submit" variant="danger" fullWidth>
              <Square size={15} />
              停止隧道
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
                  启动中…
                </>
              ) : (
                <>
                  <Play size={15} />
                  启动隧道
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
            分享地址给好友
          </p>
          <div className="mt-3">
            <CopyField value={hostname} />
          </div>
          <p className="mt-3 text-2xs" style={{ color: 'var(--mute)' }}>
            确保游戏服务监听在端口 {localPort}
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
        <li>1. 填写房间 ID 与游戏端口</li>
        <li>2. 启动隧道并复制地址</li>
        <li>3. 好友在「联机者」中连接</li>
      </ol>
    </div>
  );
}
