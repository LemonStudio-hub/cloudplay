import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/globals.css';
import { bootstrapTheme } from './hooks/useTheme';
import { bootstrapI18n } from './i18n';
import { initTauriLogListener } from './lib/tauri-logs';
import { logger } from './lib/logger';

bootstrapTheme();
bootstrapI18n();
logger.info('system', '应用启动');

// 初始化 Tauri 日志桥接（Tauri 环境外静默失败）
initTauriLogListener().catch(() => {
  // 非 Tauri 环境（纯浏览器开发）下 listen 会失败，忽略即可
});

const el = document.getElementById('root');
if (!el) throw new Error('#root missing');

createRoot(el).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
