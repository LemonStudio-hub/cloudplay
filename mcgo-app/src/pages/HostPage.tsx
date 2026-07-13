import { useState, useCallback } from 'react';
import { useAppStore } from '../store';
import { startTunnel, stopTunnel } from '../services/tauri';
import { Copy, Check, Play, Square, Loader2 } from 'lucide-react';

export function HostPage() {
  const {
    tunnelStatus,
    hostname,
    error,
    localPort,
    setTunnelStatus,
    setHostname,
    setError,
    setLocalPort,
    resetTunnel,
  } = useAppStore();

  const [roomId, setRoomId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleStart = useCallback(async () => {
    if (!roomId.trim()) {
      setError('请输入房间 ID');
      return;
    }

    setTunnelStatus('connecting');
    setError(null);

    try {
      const response = await startTunnel(roomId, localPort);

      if (response.success && response.hostname) {
        setHostname(response.hostname);
        setTunnelStatus('running');
      } else {
        setError(response.error || '启动失败');
        setTunnelStatus('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      setTunnelStatus('error');
    }
  }, [roomId, localPort, setTunnelStatus, setHostname, setError]);

  const handleStop = useCallback(async () => {
    try {
      await stopTunnel();
      resetTunnel();
    } catch (err) {
      console.error('Failed to stop tunnel:', err);
    }
  }, [resetTunnel]);

  const handleCopy = useCallback(async () => {
    if (hostname) {
      try {
        await navigator.clipboard.writeText(hostname);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = hostname;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  }, [hostname]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
            <Play className="text-primary-500" size={20} />
          </div>
          开服者模式
        </h2>

        <div className="space-y-4">
          {/* Room ID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              房间 ID
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="输入房间名称（3-20 位字母数字）"
              className="input-field"
              disabled={tunnelStatus === 'running' || tunnelStatus === 'connecting'}
              maxLength={20}
            />
            <p className="mt-1 text-xs text-gray-500">
              仅支持字母、数字、下划线和连字符
            </p>
          </div>

          {/* Local Port Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              本地端口
            </label>
            <input
              type="number"
              value={localPort}
              onChange={(e) => setLocalPort(parseInt(e.target.value) || 25565)}
              placeholder="25565"
              className="input-field"
              disabled={tunnelStatus === 'running' || tunnelStatus === 'connecting'}
              min={1}
              max={65535}
            />
            <p className="mt-1 text-xs text-gray-500">
              游戏默认端口为 25565
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {tunnelStatus === 'idle' || tunnelStatus === 'error' ? (
              <button
                onClick={handleStart}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Play size={18} />
                启动隧道
              </button>
            ) : tunnelStatus === 'connecting' ? (
              <button
                disabled
                className="btn-primary w-full flex items-center justify-center gap-2 opacity-75"
              >
                <Loader2 size={18} className="animate-spin" />
                连接中...
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="btn-danger w-full flex items-center justify-center gap-2"
              >
                <Square size={18} />
                停止隧道
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Card */}
      {tunnelStatus === 'running' && hostname && (
        <div className="card border-primary-600/50 bg-primary-900/20">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary-400 mb-2">
                ✓ 隧道已启动
              </h3>
              <p className="text-gray-300 mb-4">
                分享此地址给好友，让他们加入你的游戏：
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-800 px-4 py-3 rounded-lg text-primary-300 font-mono text-sm">
                  {hostname}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  title="复制地址"
                >
                  {copied ? (
                    <Check size={18} className="text-primary-500" />
                  ) : (
                    <Copy size={18} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400">
              💡 提示：确保你的 游戏服务器已在端口 {localPort} 上运行
            </p>
          </div>
        </div>
      )}

      {/* Error Card */}
      {tunnelStatus === 'error' && error && (
        <div className="card border-red-600/50 bg-red-900/20">
          <h3 className="text-lg font-semibold text-red-400 mb-2">✗ 错误</h3>
          <p className="text-gray-300">{error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="card bg-gray-900/50">
        <h3 className="text-lg font-semibold mb-4">使用说明</h3>
        <ol className="space-y-3 text-sm text-gray-400">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs font-medium">
              1
            </span>
            <span>输入一个唯一的房间 ID（好友将通过此 ID 连接）</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs font-medium">
              2
            </span>
            <span>设置本地端口（默认 25565，与你的 游戏服务器端口一致）</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs font-medium">
              3
            </span>
            <span>点击"启动隧道"，将生成的地址分享给好友</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs font-medium">
              4
            </span>
            <span>好友在联机者模式中输入地址即可连接</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
