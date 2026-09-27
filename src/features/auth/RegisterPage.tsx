import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRegister, getApiErrorMessage } from './hooks/useAuth';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';

export function RegisterPage() {
  const { t } = useTranslation();
  const registerMutation = useRegister();
  const [form, setForm] = useState({ companyName: '', adminName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await registerMutation.mutateAsync(form);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-extrabold text-3xl mx-auto mb-4 shadow-lg">F</div>
          <h1 className="text-2xl font-extrabold text-surface-900">{t('auth.registerTitle')}</h1>
          <p className="text-surface-500 mt-1 text-sm">{t('auth.registerSubtitle')}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-modal p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input id="reg-company" label={t('auth.companyName')} value={form.companyName} onChange={set('companyName')} placeholder={t('auth.companyNamePlaceholder')} required />
            <Input id="reg-name" label={t('auth.adminName')} value={form.adminName} onChange={set('adminName')} placeholder={t('auth.adminNamePlaceholder')} required />
            <Input id="reg-email" type="email" label={t('auth.emailLabel')} value={form.email} onChange={set('email')} placeholder={t('auth.emailPlaceholder')} autoComplete="email" required />
            <Input id="reg-phone" type="tel" label={t('common.phone')} value={form.phone} onChange={set('phone')} placeholder={t('auth.phonePlaceholder')} required />
            <Input id="reg-password" type="password" label={t('auth.passwordLabel')} value={form.password} onChange={set('password')} placeholder={t('auth.passwordPlaceholder')} autoComplete="new-password" required />

            {error && (
              <p role="alert" className="text-sm text-danger-600 bg-danger-50 border border-danger-200 rounded-xl px-4 py-3">{error}</p>
            )}

            <Button type="submit" size="lg" fullWidth loading={registerMutation.isPending} id="register-submit">
              {t('auth.registerButton')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:underline">{t('auth.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
