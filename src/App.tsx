import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from '@/routes/router';
import { queryClient } from '@/lib/query-client';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { SettingsEffects } from '@/features/settings/SettingsEffects';

// Mount the single WebSocket + initial notification fetch at app root
function AppBootstrap() {
  useNotifications();
  return <SettingsEffects />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppBootstrap />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
