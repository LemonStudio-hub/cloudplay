import { FormEvent, useCallback, useMemo, useState } from 'react';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import { useAppStore } from '../store';
import {
  normalizeServerAddress,
  validatePort,
  validateServerAddress,
} from '../lib/validation';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CopyField } from '../components/ui/CopyField';

export function ClientPage() {
  const tunnelStatus = useAppStore((s) => s.tunnelStatus);
  const error = useAppStore((s) => s.error);
  const clientPort = useAppStore((s) => s.clientPort);
  const setTunnelStatus = useAppStore((s) => s.setTunnelStatus);
  const setError = useAppStore((s) => s.setError);
  const setClientPort = useAppStore((s) => s.setClientPort);
  const setHostname = useAppStore((s) => s.setHostname);

  const [serverAddress, setServerAddress] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    address?: string | null;
    port?: string | null;
  }>({});

  const busy = tunnelStatus === 'running' || tunnelStatus === 'connecting';
  const localTarget = useMemo(
    () => `localhost:${clientPort || 25566}`,
    [clientPort],
  );

  const handleConnect = useCallback(async () => {
    const a = validateServerAddress(serverAddress);
    const p = validatePort(clientPort);
    setFieldErrors({ address: a, port: p });
    if (a || p) {
      setError(a || p);
      setTunnelStatus('error');
      return;
    }
    const host = normalizeServerAddress(serverAddress);
    setHostname(host);
    setTunnelStatus('connecting');
    setError(null);
    await new Promise((r) => setTimeout(r, 900));
    setTunnelStatus('running');
  }, [serverAddress, clientPort, setHostname, setTunnelStatus, setError]);

  const handleDisconnect = useCallback(() => {
    setTunnelStatus('idle');
    setError(null);
    setHostname(null);
  }, [setTunnelStatus, setError, setHostname]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (tunnelStatus === 'running') handleDisconnect();
    else if (tunnelStatus !== 'connecting') void handleConnect();
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <header className="mb-6">
        <p
          className="text-2xs font-medium uppercase tracking-[0.16em]"
          style={{ color: 'var(--green)' }}
        >
          Join mode
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">联机</h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--mute)' }}>
          输入好友分享的地址并接入
        </p>
      </header>

      <form onSubmit={onSubmit} className="surface p-5 space-y-4">
        <Input
          name="serverAddress"
          label="服务器地址"
          value={serverAddress}
          onChange={(e) => {
            setServerAddress(e.target.value);
            setFieldErrors((f) => ({
              ...f,
              address: e.target.value.trim()
                ? validateServerAddress(e.target.value)
                : null,
            }));
          }}
          onBlur={() => {
            const n = normalizeServerAddress(serverAddress);
            if (n && n !== serverAddress) setServerAddress(n);
          }}
          placeholder="room.cloudplay.lat"
          disabled={busy}
          autoComplete="off"
          spellCheck={false}
          error={fieldErrors.address}
          hint="支持粘贴完整链接，会自动整理"
        />

        <Input
          name="clientPort"
          label="本地代理端口"
          type="number"
          value={clientPort || ''}
          onChange={(e) => {
            const p = parseInt(e.target.value, 10);
            if (Number.isNaN(p)) {
              setClientPort(0);
              setFieldErrors((f) => ({ ...f, port: '无效端口' }));
              return;
            }
            setClientPort(p);
            setFieldErrors((f) => ({ ...f, port: validatePort(p) }));
          }}
          disabled={busy}
          min={1}
          max={65535}
          error={fieldErrors.port}
          hint="默认 25566，避免与本机服务冲突"
        />

        <div className="pt-1">
          {tunnelStatus === 'running' ? (
            <Button type="submit" variant="danger" fullWidth>
              <WifiOff size={15} />
              断开
            </Button>
          ) : (
            <Button
              type="submit"
              variant="solid"
              fullWidth
              loading={tunnelStatus === 'connecting'}
              disabled={!!fieldErrors.address || !!fieldErrors.port}
            >
              {tunnelStatus === 'connecting' ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  连接中…
                </>
              ) : (
                <>
                  <Wifi size={15} />
                  连接
                </>
              )}
            </Button>
          )}
        </div>
      </form>

      {tunnelStatus === 'running' && (
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
            Connected
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--mute)' }}>
            在游戏中添加服务器
          </p>
          <div className="mt-3">
            <CopyField value={localTarget} />
          </div>
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
        <li>1. 粘贴开服者分享的地址</li>
        <li>2. 连接成功后复制 localhost 地址</li>
        <li>3. 在游戏多人模式中加入该服务器</li>
      </ol>
    </div>
  );
}
