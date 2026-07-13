import { useAppStore } from '../store';

export function StatusBar() {
  const { tunnelStatus, hostname, localPort, mode } = useAppStore();

  const statusText = {
    idle: '就绪',
    connecting: '连接中...',
    running: '运行中',
    error: '错误',
  };

  const statusColor = {
    idle: 'bg-gray-500',
    connecting: 'bg-yellow-500 animate-pulse',
    running: 'bg-primary-500',
    error: 'bg-red-500',
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`status-indicator ${statusColor[tunnelStatus]}`} />
            <span className="text-gray-400">状态:</span>
            <span className="text-white">{statusText[tunnelStatus]}</span>
          </div>

          {hostname && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">地址:</span>
              <code className="text-primary-400 bg-gray-800 px-2 py-0.5 rounded text-xs">
                {hostname}
              </code>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-400">
            模式: {mode === 'host' ? '开服者' : '联机者'}
          </span>
          {mode === 'host' && (
            <span className="text-gray-400">
              本地端口: {localPort}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
