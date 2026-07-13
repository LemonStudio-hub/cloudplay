import { useAppStore } from './store';
import { Header } from './components/Header';
import { HostPage } from './pages/HostPage';
import { ClientPage } from './pages/ClientPage';
import { StatusBar } from './components/StatusBar';

function App() {
  const { mode } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {mode === 'host' ? <HostPage /> : <ClientPage />}
      </main>
      <StatusBar />
    </div>
  );
}

export default App;
