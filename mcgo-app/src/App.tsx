import { lazy, Suspense, useMemo } from 'react';
import { useAppStore } from './store';
import { Sidebar } from './components/Sidebar';
import { TitleBar } from './components/TitleBar';

const HostPage = lazy(() =>
  import('./pages/HostPage').then((m) => ({ default: m.HostPage })),
);
const ClientPage = lazy(() =>
  import('./pages/ClientPage').then((m) => ({ default: m.ClientPage })),
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

export default function App() {
  const mode = useAppStore((s) => s.mode);
  const page = useMemo(
    () => (mode === 'host' ? <HostPage /> : <ClientPage />),
    [mode],
  );

  return (
    <div className="shell">
      <TitleBar />
      <Sidebar />
      <main className="shell__main">
        <Suspense fallback={<Fallback />}>
          <div
            key={mode}
            className={
              mode === 'host' ? 'page-switch page-switch--host' : 'page-switch page-switch--client'
            }
          >
            {page}
          </div>
        </Suspense>
      </main>
    </div>
  );
}
