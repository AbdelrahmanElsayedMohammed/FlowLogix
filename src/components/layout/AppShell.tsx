import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '@/shared/components/Toast';
import { SettingsDrawer } from '@/features/settings/SettingsDrawer';
import { useUiStore } from '@/store/ui.store';

export function AppShell() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);

  return (
    <div
      className="flex min-h-screen-safe min-h-dvh bg-surface-50 dark:bg-slate-950 overflow-hidden w-full max-w-[100vw]"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0)',
        paddingLeft: 'env(safe-area-inset-left, 0)',
        paddingRight: 'env(safe-area-inset-right, 0)',
      }}
    >
      <Sidebar />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden overscroll-contain"
          style={{
            paddingTop: 'env(safe-area-inset-top, 0)',
            paddingBottom: 'env(safe-area-inset-bottom, 0)',
          }}
          onClick={() => useUiStore.getState().setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-col flex-1 min-w-0 w-full max-w-full">
        <Header />
        <main
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{
            padding: 'clamp(0.5rem, 0.3rem + 1vw, 0.75rem)',
            paddingTop: 'clamp(0.75rem, 0.5rem + 1vw, 1rem)',
          }}
        >
          <div
            className="w-full max-w-full mx-auto"
            style={{
              paddingLeft: 'clamp(0.5rem, 0.2rem + 1.2vw, 1.25rem)',
              paddingRight: 'clamp(0.5rem, 0.2rem + 1.2vw, 1.25rem)',
              paddingTop: 'clamp(0.25rem, 0.1rem + 0.5vw, 0.5rem)',
              paddingBottom: 'clamp(0.5rem, 0.2rem + 1vw, 1rem)',
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>

      <ToastContainer />
      <SettingsDrawer />
    </div>
  );
}
