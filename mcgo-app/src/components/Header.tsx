import { useAppStore } from '../store';
import { AppMode } from '../types';
import { Server, Users } from 'lucide-react';

export function Header() {
  const { mode, setMode, resetTunnel } = useAppStore();

  const handleModeSwitch = (newMode: AppMode) => {
    if (mode !== newMode) {
      resetTunnel();
      setMode(newMode);
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg className="w-10 h-10" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="headerCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#22c55e'}} />
                  <stop offset="100%" style={{stopColor:'#16a34a'}} />
                </linearGradient>
              </defs>
              <path d="M25 65 C10 65 5 55 10 48 C5 40 15 30 25 32 C28 22 42 18 50 25 C55 18 70 20 72 32 C82 30 90 40 85 48 C92 55 85 65 75 65 Z" fill="url(#headerCloudGrad)"/>
              <polygon points="40,38 40,60 62,49" fill="white"/>
            </svg>
            <div>
              <h1 className="text-xl font-bold text-white">CloudPlay 云玩</h1>
              <p className="text-xs text-gray-400">局域网游戏远程联机</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => handleModeSwitch('host')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'host'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Server size={16} />
              开服者
            </button>
            <button
              onClick={() => handleModeSwitch('client')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'client'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users size={16} />
              联机者
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
