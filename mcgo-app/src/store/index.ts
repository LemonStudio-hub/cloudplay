import { create } from 'zustand';
import { AppMode, TunnelStatus } from '../types';

interface AppState {
  // App mode
  mode: AppMode;
  setMode: (mode: AppMode) => void;

  // Tunnel state
  tunnelStatus: TunnelStatus;
  hostname: string | null;
  error: string | null;
  localPort: number;

  // Actions
  setTunnelStatus: (status: TunnelStatus) => void;
  setHostname: (hostname: string | null) => void;
  setError: (error: string | null) => void;
  setLocalPort: (port: number) => void;
  resetTunnel: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  mode: 'host',
  tunnelStatus: 'idle',
  hostname: null,
  error: null,
  localPort: 25565,

  // Actions
  setMode: (mode) => set({ mode }),
  setTunnelStatus: (tunnelStatus) => set({ tunnelStatus }),
  setHostname: (hostname) => set({ hostname }),
  setError: (error) => set({ error }),
  setLocalPort: (localPort) => set({ localPort }),
  resetTunnel: () => set({
    tunnelStatus: 'idle',
    hostname: null,
    error: null,
  }),
}));
