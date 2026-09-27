import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/lib/i18n';
import './index.css';
import App from './App';

async function enableMocking() {
  if (import.meta.env.PROD) return;
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass', // don't warn on non-API requests
  });
}

void enableMocking().then(() => {
  const root = document.getElementById('root');
  if (!root) throw new Error('Root element not found');
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
