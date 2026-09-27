import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUiStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/shared/utils/cn';

const adminLinks = [
  { to: '/dashboard',       icon: '🏠', label: 'nav.dashboard' },
  { to: '/orders',          icon: '📦', label: 'nav.orders' },
  { to: '/agents',          icon: '🧑‍💼', label: 'nav.agents' },
  { to: '/inventory',       icon: '🏭', label: 'nav.inventory' },
  { to: '/cash-settlement', icon: '💰', label: 'nav.cashSettlement' },
  { to: '/reports',         icon: '📊', label: 'nav.reports' },
];

const agentLinks = [
  { to: '/my-deliveries', icon: '🚚', label: 'nav.myDeliveries' },
];

export function Sidebar() {
  const { t } = useTranslation();
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const links = user?.role === 'DELIVERY_AGENT' ? agentLinks : adminLinks;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      id="sidebar"
      className={cn(
        'sidebar-transition flex flex-col bg-primary-950 text-white z-30 flex-shrink-0 overscroll-contain',
        'fixed inset-y-0 start-0 lg:relative lg:translate-x-0',
        'shadow-2xl lg:shadow-none',
        sidebarOpen
          ? 'w-64 sm:w-72 translate-x-0'
          : 'w-0 lg:w-16 xl:w-20 -translate-x-full lg:translate-x-0',
      )}
      aria-label="القائمة الرئيسية"
      style={{
        top: 'env(safe-area-inset-top, 0)',
        bottom: 'env(safe-area-inset-bottom, 0)',
      }}
    >
      <div
        className={cn(
          'flex items-center gap-3 border-b border-white/10 flex-shrink-0 overflow-hidden',
        )}
        style={{
          height: 'clamp(56px, 52px + 1vh, 64px)',
          paddingLeft: 'clamp(0.75rem, 0.6rem + 0.8vw, 1.25rem)',
          paddingRight: 'clamp(0.75rem, 0.6rem + 0.8vw, 1.25rem)',
        }}
      >
        <div
          className="rounded-xl bg-accent-400 flex items-center justify-center text-primary-950 font-extrabold flex-shrink-0"
          style={{
            width: 'clamp(32px, 30px + 1vw, 40px)',
            height: 'clamp(32px, 30px + 1vw, 40px)',
            fontSize: 'clamp(1rem, 0.95rem + 0.5vw, 1.25rem)',
          }}
        >
          F
        </div>
        {sidebarOpen && (
          <span
            className="font-extrabold tracking-tight whitespace-nowrap"
            style={{ fontSize: 'clamp(1rem, 0.95rem + 0.5vw, 1.25rem)' }}
          >
            FlowLogix
          </span>
        )}
      </div>

      <nav
        className="flex-1 overflow-y-auto no-scrollbar flex flex-col"
        aria-label="التنقل"
        style={{
          padding: 'clamp(0.5rem, 0.4rem + 0.5vw, 1rem)',
          gap: 'clamp(0.125rem, 0.1rem + 0.3vw, 0.25rem)',
        }}
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => {
              if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
            className={({ isActive }) =>
              cn(
                'w-full min-w-0 flex items-center rounded-xl font-medium transition-all duration-150',
                'touch-manipulation tap-highlight-transparent',
                sidebarOpen
                  ? 'gap-3'
                  : 'gap-0 justify-center',
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
              )
            }
            style={{
              minHeight: '48px',
              minWidth: '100%',
              paddingTop: 'clamp(0.5rem, 0.45rem + 0.3vw, 0.625rem)',
              paddingBottom: 'clamp(0.5rem, 0.45rem + 0.3vw, 0.625rem)',
              paddingLeft: sidebarOpen ? 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)' : '0.125rem',
              paddingRight: sidebarOpen ? 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)' : '0.125rem',
              fontSize: 'clamp(0.8rem, 0.75rem + 0.3vw, 0.9rem)',
            }}
            title={!sidebarOpen ? t(link.label) : undefined}
          >
            <span
              className="flex-shrink-0 text-center"
              style={{
                fontSize: sidebarOpen
                  ? 'clamp(1rem, 0.95rem + 0.5vw, 1.25rem)'
                  : 'clamp(1.1rem, 1rem + 0.5vw, 1.4rem)',
                width: sidebarOpen ? 'clamp(24px, 22px + 0.5vw, 28px)' : 'auto',
              }}
              aria-hidden="true"
            >
              {link.icon}
            </span>
            {sidebarOpen && (
              <span className="truncate min-w-0 flex-1">{t(link.label)}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div
        className="border-t border-white/10 flex-shrink-0"
        style={{
          padding: 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)',
        }}
      >
        {sidebarOpen && user && (
          <div
            className="flex items-center gap-3 mb-2"
            style={{
              padding: 'clamp(0.25rem, 0.2rem + 0.3vw, 0.5rem)',
            }}
          >
            <div
              className="rounded-full bg-accent-400 flex items-center justify-center text-primary-950 font-bold flex-shrink-0"
              style={{
                width: 'clamp(32px, 30px + 0.5vw, 36px)',
                height: 'clamp(32px, 30px + 0.5vw, 36px)',
                fontSize: 'clamp(0.75rem, 0.7rem + 0.3vw, 0.875rem)',
              }}
            >
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white truncate" style={{ fontSize: 'clamp(0.8rem, 0.75rem + 0.3vw, 0.9rem)' }}>
                {user.name}
              </p>
              <p className="text-white/50 truncate" style={{ fontSize: 'clamp(0.65rem, 0.6rem + 0.2vw, 0.75rem)' }}>
                {user.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'w-full min-w-0 flex items-center rounded-xl font-medium',
            'text-white/70 hover:bg-white/10 hover:text-white transition-colors',
            'touch-manipulation tap-highlight-transparent',
            sidebarOpen ? 'gap-3' : 'gap-0 justify-center',
          )}
          style={{
            minHeight: '48px',
            minWidth: '100%',
            paddingTop: 'clamp(0.5rem, 0.45rem + 0.3vw, 0.625rem)',
            paddingBottom: 'clamp(0.5rem, 0.45rem + 0.3vw, 0.625rem)',
            paddingLeft: sidebarOpen ? 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)' : '0.125rem',
            paddingRight: sidebarOpen ? 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)' : '0.125rem',
            fontSize: 'clamp(0.8rem, 0.75rem + 0.3vw, 0.9rem)',
          }}
          aria-label={t('nav.logout')}
          title={!sidebarOpen ? t('nav.logout') : undefined}
        >
          <span
            className="flex-shrink-0 text-center"
            style={{
              fontSize: sidebarOpen
                ? 'clamp(1rem, 0.95rem + 0.5vw, 1.25rem)'
                : 'clamp(1.1rem, 1rem + 0.5vw, 1.4rem)',
              width: sidebarOpen ? 'clamp(24px, 22px + 0.5vw, 28px)' : 'auto',
            }}
            aria-hidden="true"
          >
            🚪
          </span>
          {sidebarOpen && <span>{t('nav.logout')}</span>}
        </button>
      </div>
    </aside>
  );
}
