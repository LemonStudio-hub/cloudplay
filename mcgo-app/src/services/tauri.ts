import { invoke } from '@tauri-apps/api/core';
import { StartTunnelResponse } from '../types';
import { logger } from '../lib/logger';
import { t } from '../i18n';

/* ── 速度测试相关类型 ── */

export interface SpeedTestResult {
  ip: string;
  latencyMs: number;
  lossPercent: number;
  speedMbps: number;
}

export interface SpeedStatus {
  enabled: boolean;
  currentIp: string | null;
}

export async function startTunnel(roomId: string, localPort: number): Promise<StartTunnelResponse> {
  logger.info('tunnel', t('log.tunnel') + ': start', { roomId, localPort });
  try {
    const response = await invoke<StartTunnelResponse>('start_tunnel', {
      request: {
        room_id: roomId,
        local_port: localPort,
      },
    });
    if (response.success) {
      logger.info('tunnel', t('log.tunnel') + ': started', { hostname: response.hostname });
    } else {
      logger.error('tunnel', t('log.tunnel') + ': start failed', { error: response.error });
    }
    return response;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : t('api.tunnelFailed');
    logger.error('tunnel', t('log.tunnel') + ': exception', { error: errMsg });
    return { success: false, error: errMsg };
  }
}

export async function stopTunnel(): Promise<{ success: boolean; error?: string }> {
  logger.info('tunnel', t('log.tunnel') + ': stopping');
  try {
    await invoke('stop_tunnel');
    logger.info('tunnel', t('log.tunnel') + ': stopped');
    return { success: true };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : t('api.stopFailed');
    logger.error('tunnel', t('log.tunnel') + ': stop exception', { error: errMsg });
    return { success: false, error: errMsg };
  }
}

export async function checkCloudflared(): Promise<boolean> {
  try {
    const ready = await invoke<boolean>('check_cloudflared');
    logger.info('system', `cloudflared: ${ready ? 'ready' : 'unavailable'}`);
    return ready;
  } catch (error) {
    logger.warn('system', 'cloudflared check failed', { error: String(error) });
    return false;
  }
}

/* ── 速度优化 ── */

export async function runSpeedTest(): Promise<SpeedTestResult> {
  logger.info('system', 'Speed test started');
  try {
    const result = await invoke<SpeedTestResult>('run_speed_test');
    logger.info('system', `Speed test done: ${result.ip} (${result.latencyMs}ms)`);
    return result;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error('system', 'Speed test failed', { error: errMsg });
    throw new Error(errMsg);
  }
}

export async function applySpeedOptimization(ip: string): Promise<void> {
  logger.info('system', `Applying speed optimization: ${ip}`);
  try {
    await invoke('apply_speed_optimization', { ip });
    logger.info('system', 'Speed optimization applied');
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error('system', 'Apply speed optimization failed', { error: errMsg });
    throw new Error(errMsg);
  }
}

export async function removeSpeedOptimization(): Promise<void> {
  logger.info('system', 'Removing speed optimization');
  try {
    await invoke('remove_speed_optimization');
    logger.info('system', 'Speed optimization removed');
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error('system', 'Remove speed optimization failed', { error: errMsg });
    throw new Error(errMsg);
  }
}

export async function getSpeedStatus(): Promise<SpeedStatus> {
  try {
    return await invoke<SpeedStatus>('get_speed_status');
  } catch {
    return { enabled: false, currentIp: null };
  }
}
