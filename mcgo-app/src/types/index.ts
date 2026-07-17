export interface TokenResponse {
  success: boolean;
  data?: {
    hostname: string;
    token: string;
    expiresIn: number;
  };
  error?: string;
}

export interface StartTunnelResponse {
  success: boolean;
  hostname?: string;
  error?: string;
}

export type TunnelStatus = 'idle' | 'connecting' | 'running' | 'error';

export type AppMode = 'host' | 'client' | 'settings';

export interface TunnelState {
  status: TunnelStatus;
  hostname: string | null;
  error: string | null;
  localPort: number;
}
