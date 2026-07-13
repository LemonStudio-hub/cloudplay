import { useState, useCallback } from 'react';
import { useAppStore } from '../store';
import { Loader2, Wifi, WifiOff, Users } from 'lucide-react';

export function ClientPage() {
  const { tunnelStatus, setTunnelStatus, setError, localPort, setLocalPort } = useAppStore();
  const [serverAddress, setServerAddress] = useState('');
  const [connectPort, setConnectPort] = useState(25566);

  const handleConnect = useCallback(async () => {
    if (!serverAddress.trim()) {
      setError('请输入服务器地址');
      setTunnelStatus('error');
      return;
    }

    setTunnelStatus('connecting');
    setError(null);

    // Simulate connection for demo - in real app, this would call Tauri backend
    setTimeout(() => {
      setTunnelStatus('running');
    }, 1500);
  }, [serverAddress, setTunnelStatus, setError]);

  const handleDisconnect = useCallback(() => {
    setTunnelStatus('idle');
    setError(null);
  }, [setTunnelStatus, setError]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <Users className="text-blue-500" size={20} />
          </div>
          联机者模式
        </h2>

        <div className="space-y-4">
          {/* Server Address Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              服务器地址
            </label>
            <input
              type="text"
              value={serverAddress}
              onChange={(e) => setServerAddress(e.target.value)}
              placeholder="例如: john123.cloudplay.lat"
              className="input-field"
              disabled={tunnelStatus === 'running' || tunnelStatus === 'connecting'}
            />
            <p className="mt-1 text-xs text-gray-500">
              输入开服者分享的地址
            </p>
          </div>

          {/* Local Port Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              本地端口
            </label>
            <input
              type="number"
              value={connectPort}
              onChange={(e) => setConnectPort(parseInt(e.target.value) || 25566)}
              placeholder="25566"
              className="input-field"
              disabled={tunnelStatus === 'running' || tunnelStatus === 'connecting'}
              min={1}
              max={65535}
            />
            <p className="mt-1 text-xs text-gray-500">
              本地代理端口（默认 25566，避免与服务器端口冲突）
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {tunnelStatus === 'idle' || tunnelStatus === 'error' ? (
              <button
                onClick={handleConnect}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Wifi size={18} />
                连接游戏
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
                onClick={handleDisconnect}
                className="btn-danger w-full flex items-center justify-center gap-2"
              >
                <WifiOff size={18} />
                断开连接
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Connection Success */}
      {tunnelStatus === 'running' && (
        <div className="card border-blue-600/50 bg-blue-900/20">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">
            ✓ 已连接
          </h3>
          <p className="text-gray-300 mb-4">
            隧道已建立，请在 游戏中连接以下地址：
          </p>
          <div className="bg-gray-800 px-4 py-3 rounded-lg">
            <code className="text-blue-300 font-mono text-lg">
              localhost:{connectPort}
            </code>
          </div>
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400">
              💡 提示：打开游戏，选择"多人游戏"，添加服务器，输入上面的地址即可
            </p>
          </div>
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
            <span>从开服者那里获取服务器地址（如 <code className="text-blue-400">john123.cloudplay.lat</code>）</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs font-medium">
              2
            </span>
            <span>输入地址并点击"连接游戏"</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs font-medium">
              3
            </span>
            <span>等待连接建立，然后在 游戏中连接 <code className="text-blue-400">localhost:25566</code></span>
          </li>
        </ol>
      </div>
    </div>
  );
}
