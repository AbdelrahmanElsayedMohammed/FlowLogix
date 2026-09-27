import { useTranslation } from 'react-i18next';
import { useUiStore } from '@/store/ui.store';
import { NotificationDropdown } from '@/features/notifications/NotificationDropdown';
import { useAuthStore } from '@/store/auth.store';

export function Header() {
  const { t } = useTranslation();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const toggleSettings = useUiStore((s) => s.toggleSettings);
  const settingsOpen = useUiStore((s) => s.settingsOpen);
  const user = useAuthStore((s) => s.user);

  return (
    <header
      className="bg-white dark:bg-slate-900 border-b border-surface-100 dark:border-slate-700 flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0 z-10 transition-colors w-full max-w-full"
      style={{
        minHeight: 'clamp(56px, 52px + 1vh, 64px)',
        paddingLeft: 'clamp(0.5rem, 0.3rem + 0.8vw, 1rem)',
        paddingRight: 'clamp(0.5rem, 0.3rem + 0.8vw, 1rem)',
      }}
    >
      <button
        onClick={toggleSidebar}
        className="p-2 sm:p-2.5 rounded-lg text-surface-500 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0 min-touch-sm tap-highlight-transparent touch-manipulation"
        aria-label="فتح/إغلاق القائمة"
        aria-expanded={useUiStore.getState().sidebarOpen}
        aria-controls="sidebar"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <span className="font-extrabold text-primary-700 dark:text-primary-400 text-base sm:text-lg lg:hidden whitespace-nowrap truncate">
        FlowLogix
      </span>

      <div className="flex-1 min-w-0" />

      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        <NotificationDropdown />

        <button
          id="settings-toggle-btn"
          onClick={toggleSettings}
          aria-label={t('common.settingsButton')}
          aria-expanded={settingsOpen}
          aria-haspopup="dialog"
          className={`p-2 sm:p-2.5 rounded-lg transition-colors flex-shrink-0 min-touch-sm tap-highlight-transparent touch-manipulation ${
            settingsOpen
              ? 'bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-300'
              : 'text-surface-500 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-slate-800'
          }`}
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 max-w-[40vw] sm:max-w-[30vw] md:max-w-[200px]">
          <div
            className="rounded-full bg-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0"
            style={{
              width: 'clamp(32px, 28px + 1vw, 40px)',
              height: 'clamp(32px, 28px + 1vw, 40px)',
              fontSize: 'clamp(0.75rem, 0.7rem + 0.3vw, 0.875rem)',
            }}
          >
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <span className="hidden sm:block text-xs sm:text-sm font-semibold text-surface-700 dark:text-slate-300 truncate">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
}
