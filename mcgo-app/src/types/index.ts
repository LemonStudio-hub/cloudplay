export interface StartTunnelResponse {
  success: boolean;
  hostname?: string;
  error?: string;
}

export type TunnelStatus = 'idle' | 'connecting' | 'running' | 'error';

export type AppMode = 'host' | 'client' | 'settings';
