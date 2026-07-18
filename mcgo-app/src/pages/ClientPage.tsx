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
import { logger } from '../lib/logger';
import { useI18n } from '../i18n';
import { DEFAULT_CLIENT_PORT } from '../lib/constants';

export function ClientPage() {
  const tunnelStatus = useAppStore((s) => s.tunnelStatus);
  const error = useAppStore((s) => s.error);
  const clientPort = useAppStore((s) => s.clientPort);
  const setTunnelStatus = useAppStore((s) => s.setTunnelStatus);
  const setError = useAppStore((s) => s.setError);
  const setClientPort = useAppStore((s) => s.setClientPort);
  const setHostname = useAppStore((s) => s.setHostname);
  const { t } = useI18n();

  const [serverAddress, setServerAddress] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    address?: string | null;
    port?: string | null;
  }>({});

  const busy = tunnelStatus === 'running' || tunnelStatus === 'connecting';
  const localTarget = useMemo(
    () => `localhost:${clientPort || DEFAULT_CLIENT_PORT}`,
    [clientPort],
  );

  const handleConnect = useCallback(async () => {
    try {
      const aKey = validateServerAddress(serverAddress);
      const pKey = validatePort(clientPort);
      const a = aKey ? t(aKey as any) : null;
      const p = pKey ? t(pKey as any) : null;
      setFieldErrors({ address: a, port: p });
      if (a || p) {
        logger.warn('app', '联机表单验证失败', { serverAddress, clientPort, addressErr: a, portErr: p });
        setError(a || p);
        setTunnelStatus('error');
        return;
      }
      const host = normalizeServerAddress(serverAddress);
      logger.info('app', '用户发起联机连接', { serverAddress: host, clientPort });
      setHostname(host);
      setTunnelStatus('connecting');
      setError(null);
      await new Promise((r) => setTimeout(r, 900));
      logger.info('app', '联机连接已建立', { target: `localhost:${clientPort}` });
      setTunnelStatus('running');
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : t('client.invalidPort');
      logger.error('app', '联机连接异常', { error: errMsg });
      setError(errMsg);
      setTunnelStatus('error');
    }
  }, [serverAddress, clientPort, setHostname, setTunnelStatus, setError, t]);

  const handleDisconnect = useCallback(() => {
    logger.info('app', '用户断开联机连接');
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
        <h2 className="mt-1 text-xl font-semibold tracking-tight">{t('client.title')}</h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--mute)' }}>
          {t('client.subtitle')}
        </p>
      </header>

      <form onSubmit={onSubmit} className="surface p-5 space-y-4">
        <Input
          name="serverAddress"
          label={t('client.address')}
          value={serverAddress}
          onChange={(e) => {
            setServerAddress(e.target.value);
            const addrErrKey = e.target.value.trim() ? validateServerAddress(e.target.value) : null;
            setFieldErrors((f) => ({
              ...f,
              address: addrErrKey ? t(addrErrKey as any) : null,
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
          hint={t('client.addressHint')}
        />

        <Input
          name="clientPort"
          label={t('client.port')}
          type="number"
          value={clientPort || ''}
          onChange={(e) => {
            const p = parseInt(e.target.value, 10);
            if (Number.isNaN(p)) {
              setClientPort(0);
              setFieldErrors((f) => ({ ...f, port: t('client.invalidPort') }));
              return;
            }
            setClientPort(p);
            const portErrKey = validatePort(p);
            setFieldErrors((f) => ({ ...f, port: portErrKey ? t(portErrKey as any) : null }));
          }}
          disabled={busy}
          min={1}
          max={65535}
          error={fieldErrors.port}
          hint={t('client.portHint')}
        />

        <div className="pt-1">
          {tunnelStatus === 'running' ? (
            <Button type="submit" variant="danger" fullWidth>
              <WifiOff size={15} />
              {t('client.disconnect')}
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
                  {t('client.connecting')}
                </>
              ) : (
                <>
                  <Wifi size={15} />
                  {t('client.connect')}
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
            {t('client.connected')}
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
        <li>{t('client.steps.1')}</li>
        <li>{t('client.steps.2')}</li>
        <li>{t('client.steps.3')}</li>
      </ol>
    </div>
  );
}
