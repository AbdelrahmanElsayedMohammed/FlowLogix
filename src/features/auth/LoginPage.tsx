import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLogin, getApiErrorMessage } from './hooks/useAuth';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useAuthStore } from '@/store/auth.store';
import type { AuthUser } from '@/lib/api-types';

export function LoginPage() {
  const { t } = useTranslation();
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();
  const [email, setEmail] = useState('admin@flowlogix.io');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleDevSkip = () => {
    const devUser: AuthUser = {
      id: 'dev-user-1',
      name: 'Dev Admin',
      email: 'dev@flowlogix.io',
      role: 'ADMIN',
      tenantId: 'tenant-demo',
      avatarUrl: undefined,
    };
    setTokens('dev-access-token', 'dev-refresh-token');
    setUser(devUser);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div
      className="flex min-h-screen-safe min-h-dvh bg-surface-50 w-full max-w-[100vw] overflow-x-hidden"
      dir="rtl"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
      }}
    >
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 flex-col items-center justify-center relative overflow-hidden"
        style={{
          padding: 'clamp(1.5rem, 1rem + 3vw, 4rem)',
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          aria-hidden="true"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
        <div className="relative z-10 text-center text-white w-full max-w-lg">
          <div
            className="bg-accent-400 flex items-center justify-center text-primary-950 font-extrabold shadow-2xl mx-auto mb-8"
            style={{
              width: 'clamp(3.5rem, 3rem + 3vw, 5rem)',
              height: 'clamp(3.5rem, 3rem + 3vw, 5rem)',
              borderRadius: 'clamp(0.75rem, 0.5rem + 1vw, 1.5rem)',
              fontSize: 'clamp(1.75rem, 1.5rem + 2vw, 3rem)',
            }}
          >
            F
          </div>
          <h1 className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(2rem, 1.5rem + 3vw, 3.5rem)', marginBottom: 'clamp(0.5rem, 0.3rem + 1vw, 1rem)' }}>
            FlowLogix
          </h1>
          <p className="text-white/70 leading-relaxed mx-auto" style={{ fontSize: 'clamp(0.875rem, 0.75rem + 0.8vw, 1.125rem)', maxWidth: '24rem' }}>
            نظام إدارة الشحن والمستودعات لشركات اللوجستيات الصغيرة وتجار الجملة في مصر
          </p>
          <div
            className="grid grid-cols-3 text-center mx-auto"
            style={{
              marginTop: 'clamp(2rem, 1.5rem + 3vw, 4rem)',
              gap: 'clamp(0.5rem, 0.3rem + 1vw, 1.5rem)',
              maxWidth: '32rem',
            }}
          >
            {[
              { icon: '📦', label: 'إدارة الطلبات' },
              { icon: '🚚', label: 'تتبع المندوبين' },
              { icon: '💰', label: 'التسوية النقدية' },
            ].map((f) => (
              <div
                key={f.label}
                className="bg-white/10"
                style={{
                  padding: 'clamp(0.75rem, 0.5rem + 1vw, 1.25rem)',
                  borderRadius: 'clamp(0.5rem, 0.4rem + 0.5vw, 1rem)',
                }}
              >
                <div style={{ fontSize: 'clamp(1.25rem, 1rem + 1.5vw, 2rem)', marginBottom: 'clamp(0.25rem, 0.15rem + 0.5vw, 0.5rem)' }}>{f.icon}</div>
                <p className="font-semibold text-white/80" style={{ fontSize: 'clamp(0.625rem, 0.55rem + 0.5vw, 0.875rem)' }}>{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div
        className="flex-1 flex items-center justify-center bg-surface-50 w-full"
        style={{
          padding: 'clamp(1rem, 0.75rem + 1.5vw, 2rem)',
        }}
      >
        <div className="w-full" style={{ maxWidth: 'min(100%, 28rem)' }}>
          {/* Mobile logo */}
          <div className="flex justify-center lg:hidden" style={{ marginBottom: 'clamp(1.5rem, 1rem + 2vw, 2.5rem)' }}>
            <div
              className="bg-primary-600 flex items-center justify-center text-white font-extrabold shadow-lg"
              style={{
                width: 'clamp(3rem, 2.5rem + 3vw, 4rem)',
                height: 'clamp(3rem, 2.5rem + 3vw, 4rem)',
                borderRadius: 'clamp(0.5rem, 0.4rem + 0.5vw, 1rem)',
                fontSize: 'clamp(1.5rem, 1.25rem + 2vw, 2.25rem)',
              }}
            >
              F
            </div>
          </div>

          <div
            className="bg-white shadow-modal w-full"
            style={{
              padding: 'clamp(1.25rem, 1rem + 2vw, 2.5rem)',
              borderRadius: 'clamp(1rem, 0.85rem + 0.8vw, 1.75rem)',
            }}
          >
            <div style={{ marginBottom: 'clamp(1.5rem, 1rem + 2vw, 2.5rem)' }}>
              <h2
                className="font-extrabold text-surface-900"
                style={{ fontSize: 'clamp(1.25rem, 1rem + 1.5vw, 2rem)' }}
              >
                {t('auth.loginTitle')}
              </h2>
              <p
                className="text-surface-500"
                style={{
                  marginTop: 'clamp(0.125rem, 0.1rem + 0.2vw, 0.25rem)',
                  fontSize: 'clamp(0.75rem, 0.7rem + 0.3vw, 0.875rem)',
                }}
              >
                {t('auth.loginSubtitle')}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-0 flex flex-col w-full"
              style={{ gap: 'clamp(0.75rem, 0.6rem + 0.8vw, 1.5rem)' }}
              noValidate
            >
              <Input
                label={t('auth.emailLabel')}
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                autoComplete="email"
                required
                leftElement={
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                }
              />
              <Input
                label={t('auth.passwordLabel')}
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                autoComplete="current-password"
                required
                leftElement={
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                }
              />

              {error && (
                <p
                  role="alert"
                  className="text-sm text-danger-600 bg-danger-50 border border-danger-200"
                  style={{
                    padding: 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)',
                    borderRadius: 'clamp(0.5rem, 0.4rem + 0.4vw, 0.75rem)',
                    fontSize: 'clamp(0.7rem, 0.65rem + 0.3vw, 0.875rem)',
                  }}
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={loginMutation.isPending}
                id="login-submit"
              >
                {t('auth.loginButton')}
              </Button>
            </form>

            <p
              className="text-center text-surface-500"
              style={{
                marginTop: 'clamp(1rem, 0.75rem + 1.5vw, 1.75rem)',
                fontSize: 'clamp(0.7rem, 0.65rem + 0.3vw, 0.875rem)',
              }}
            >
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="font-semibold text-primary-600 hover:underline touch-manipulation">
                {t('auth.register')}
              </Link>
            </p>

            {import.meta.env.DEV && (
              <div
                className="border-t border-surface-200"
                style={{
                  marginTop: 'clamp(1rem, 0.75rem + 1vw, 1.5rem)',
                  paddingTop: 'clamp(1rem, 0.75rem + 1vw, 1.5rem)',
                }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth
                  onClick={handleDevSkip}
                  id="login-skip"
                  size="md"
                >
                  تخطي تسجيل الدخول (DEV)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
