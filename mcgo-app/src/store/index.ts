import { create } from 'zustand';
import { AppMode, TunnelStatus } from '../types';

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
  localPort: 25565,
  clientPort: 25566,
  apiOnline: null,
  cloudflaredReady: null,

  setMode: (mode) => set({ mode }),
  setTunnelStatus: (tunnelStatus) => set({ tunnelStatus }),
  setHostname: (hostname) => set({ hostname }),
  setError: (error) => set({ error }),
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

/** Selectors to minimize re-renders */
export const selectMode = (s: AppState) => s.mode;
export const selectTunnelStatus = (s: AppState) => s.tunnelStatus;
export const selectError = (s: AppState) => s.error;
