import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { bootstrapTheme } from './hooks/useTheme';

bootstrapTheme();

const el = document.getElementById('root');
if (!el) throw new Error('#root missing');

createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
