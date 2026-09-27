/**
 * SettingsEffects.tsx
 *
 * A renderless component mounted once at the app root.
 * Watches the settings store and synchronises its values
 * to the DOM: dark mode class, font size CSS variable,
 * html lang/dir attributes, and notification preferences.
 */
import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settings.store';
import i18n from '@/lib/i18n';

const fontSizeMap = {
  sm: '13px',
  md: '15px',
  lg: '17px',
  xl: '19px',
};

export function SettingsEffects() {
  const { theme, fontSize, language, notificationsEnabled } = useSettingsStore();

  // ── Theme ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark);

    root.classList.toggle('dark', isDark);

    // Listen for system preference changes when in "system" mode
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => root.classList.toggle('dark', e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  // ── Font size ────────────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--font-size-base',
      fontSizeMap[fontSize],
    );
  }, [fontSize]);

  // ── Language & direction ─────────────────────────────────────────────────────
  useEffect(() => {
    const isAr = language === 'ar';
    document.documentElement.lang = language;
    document.documentElement.dir  = isAr ? 'rtl' : 'ltr';
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language]);

  // ── Notifications permission ─────────────────────────────────────────────────
  useEffect(() => {
    if (!notificationsEnabled) return;
    if ('Notification' in window && Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  }, [notificationsEnabled]);

  return null;
}
