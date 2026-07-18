import { lazy, Suspense, useEffect } from 'react';
import { useAppStore } from './store';
import { Sidebar } from './components/Sidebar';
import { TitleBar } from './components/TitleBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import type { AppMode } from './types';

const HostPage = lazy(() =>
  import('./pages/HostPage').then((m) => ({ default: m.HostPage })),
);
const ClientPage = lazy(() =>
  import('./pages/ClientPage').then((m) => ({ default: m.ClientPage })),
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);

function Fallback() {
  return (
    <div className="mx-auto max-w-lg animate-pulse space-y-3">
      <div className="h-8 w-40 rounded" style={{ background: 'var(--raised)' }} />
      <div
        className="h-48 rounded-xl"
        style={{ background: 'var(--panel)', border: '1px solid var(--line)' }}
      />
    </div>
  );
}

/**
 * Three full interfaces sharing one stage.
 * Only one is on-stage; the others sit a full viewport away and slide in as a whole page.
 */
function PageStack({ mode }: { mode: AppMode }) {
  return (
    <div className="page-stack" data-mode={mode}>
      <div
        className="page-panel"
        data-page="host"
        aria-hidden={mode !== 'host'}
      >
        <ErrorBoundary>
          <HostPage />
        </ErrorBoundary>
      </div>
      <div
        className="page-panel"
        data-page="client"
        aria-hidden={mode !== 'client'}
      >
        <ErrorBoundary>
          <ClientPage />
        </ErrorBoundary>
      </div>
      <div
        className="page-panel"
        data-page="settings"
        aria-hidden={mode !== 'settings'}
      >
        <ErrorBoundary>
          <SettingsPage />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default function App() {
  const mode = useAppStore((s) => s.mode);

  useEffect(() => {
    void import('./pages/HostPage');
    void import('./pages/ClientPage');
    void import('./pages/SettingsPage');
  }, []);

  return (
    <div className="shell">
      <TitleBar />
      <Sidebar />
      <main className="shell__main">
        <Suspense fallback={<Fallback />}>
          <PageStack mode={mode} />
        </Suspense>
      </main>
    </div>
  );
}
