import { invoke } from '@tauri-apps/api/core';
import { StartTunnelResponse } from '../types';

export async function startTunnel(roomId: string, localPort: number): Promise<StartTunnelResponse> {
  try {
    const response = await invoke<StartTunnelResponse>('start_tunnel', {
      request: {
        room_id: roomId,
        local_port: localPort,
      },
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '启动隧道失败',
    };
  }
}

export async function stopTunnel(): Promise<{ success: boolean; error?: string }> {
  try {
    await invoke('stop_tunnel');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '停止隧道失败',
    };
  }
}

export async function checkPortAvailable(port: number): Promise<boolean> {
  try {
    return await invoke<boolean>('check_port', { port });
  } catch {
    return false;
  }
}

export async function checkCloudflared(): Promise<boolean> {
  try {
    return await invoke<boolean>('check_cloudflared');
  } catch {
    return false;
  }
}
