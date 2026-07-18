import { create } from 'zustand';
import { AppMode, TunnelStatus } from '../types';
import { logger } from '../lib/logger';
import { DEFAULT_LOCAL_PORT, DEFAULT_CLIENT_PORT } from '../lib/constants';

interface AppState {
  mode: AppMode;
  tunnelStatus: TunnelStatus;
  hostname: string | null;
  error: string | null;
  localPort: number;
  clientPort: number;
  apiOnline: boolean | null;
  cloudflaredReady: boolean | null;  // null = 检测中

  setMode: (mode: AppMode) => void;
  setTunnelStatus: (status: TunnelStatus) => void;
  setHostname: (hostname: string | null) => void;
  setError: (error: string | null) => void;
  setLocalPort: (port: number) => void;
  setClientPort: (port: number) => void;
  setApiOnline: (online: boolean | null) => void;
  setCloudflaredReady: (ready: boolean | null) => void;
  resetTunnel: () => void;
  isBusy: () => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  mode: 'host',
  tunnelStatus: 'idle',
  hostname: null,
  error: null,
  localPort: DEFAULT_LOCAL_PORT,
  clientPort: DEFAULT_CLIENT_PORT,
  apiOnline: null,
  cloudflaredReady: null,

  setMode: (mode) => {
    logger.info('app', `Mode: ${mode}`);
    set({ mode });
  },
  setTunnelStatus: (tunnelStatus) => {
    const prev = get().tunnelStatus;
    if (prev !== tunnelStatus) {
      logger.info('app', `Tunnel: ${prev} → ${tunnelStatus}`);
    }
    set({ tunnelStatus });
  },
  setHostname: (hostname) => set({ hostname }),
  setError: (error) => {
    if (error) {
      logger.error('app', error);
    }
    set({ error });
  },
  setLocalPort: (localPort) => set({ localPort }),
  setClientPort: (clientPort) => set({ clientPort }),
  setApiOnline: (apiOnline) => set({ apiOnline }),
  setCloudflaredReady: (cloudflaredReady) => set({ cloudflaredReady }),
  resetTunnel: () =>
    set({
      tunnelStatus: 'idle',
      hostname: null,
      error: null,
    }),
  isBusy: () => {
    const s = get().tunnelStatus;
    return s === 'running' || s === 'connecting';
  },
}));
