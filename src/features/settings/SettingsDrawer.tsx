/**
 * SettingsDrawer.tsx
 *
 * A slide-in settings panel that covers all customization options.
 * Uses the settings store — every change is instant and auto-persisted.
 */
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useUiStore } from '@/store/ui.store';
import { useSettingsStore, type Theme, type Language, type NumberSystem, type DateFormat, type FontSize } from '@/store/settings.store';
import { useFormatter } from '@/shared/hooks/useFormatter';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/shared/components/Button';

// ─── Helper: Section wrapper ──────────────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">{icon}</span>
        <h3 className="text-sm font-bold text-surface-700 dark:text-slate-300 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="bg-surface-50 dark:bg-slate-800 rounded-2xl p-4 space-y-4">
        {children}
      </div>
    </div>
  );
}

// ─── Helper: Toggle row ───────────────────────────────────────────────────────
function ToggleRow({ label, description, checked, onChange, id }: {
  label: string; description?: string; checked: boolean; onChange: (v: boolean) => void; id: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-semibold text-surface-800 dark:text-slate-200 cursor-pointer">{label}</label>
        {description && <p className="text-xs text-surface-500 dark:text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative flex-shrink-0 h-7 w-12 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          checked ? 'bg-primary-600' : 'bg-surface-300 dark:bg-slate-600',
        )}
      >
        <span className={cn(
          'absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200',
          checked ? 'start-6' : 'start-1',
        )} />
      </button>
    </div>
  );
}

// ─── Helper: Segmented control ───────────────────────────────────────────────
function SegmentedControl<T extends string>({
  value, onChange, options, id,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  id: string;
}) {
  return (
    <div
      id={id}
      role="group"
      className="flex rounded-xl border border-surface-200 dark:border-slate-600 overflow-hidden bg-white dark:bg-slate-900"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={cn(
            'flex-1 py-2 text-xs font-semibold transition-all duration-150 text-center',
            value === opt.value
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-surface-600 dark:text-slate-400 hover:bg-surface-50 dark:hover:bg-slate-800',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Helper: Radio card grid ──────────────────────────────────────────────────
function RadioCards<T extends string>({
  value, onChange, options, cols = 2,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; preview?: string }[];
  cols?: number;
}) {
  return (
    <div className={cn('grid gap-2', cols === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={cn(
            'rounded-xl border-2 p-3 text-center transition-all duration-150',
            value === opt.value
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
              : 'border-surface-200 dark:border-slate-600 hover:border-primary-300 bg-white dark:bg-slate-900',
          )}
        >
          {opt.preview && (
            <div className="text-lg font-bold text-surface-700 dark:text-slate-300 mb-1">{opt.preview}</div>
          )}
          <p className={cn('text-xs font-semibold leading-tight', value === opt.value ? 'text-primary-700 dark:text-primary-300' : 'text-surface-600 dark:text-slate-400')}>
            {opt.label}
          </p>
        </button>
      ))}
    </div>
  );
}

// ─── Main SettingsDrawer ──────────────────────────────────────────────────────
export function SettingsDrawer() {
  const { t } = useTranslation();
  const isOpen = useUiStore((s) => s.settingsOpen);
  const closeSettings = useUiStore((s) => s.closeSettings);
  const { formatCurrency, formatDate, formatNumber } = useFormatter();

  const {
    theme, setTheme,
    fontSize, setFontSize,
    language, setLanguage,
    numberSystem, setNumberSystem,
    dateFormat, setDateFormat,
    showCurrencySymbol, setShowCurrencySymbol,
    notificationsEnabled, setNotificationsEnabled,
    soundEnabled, setSoundEnabled,
    resetAll, clearLocalData,
  } = useSettingsStore();

  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  // Show saved banner whenever any setting changes
  const showSaved = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2000);
  };

  // Wrap setters to trigger banner
  const wrap = <T,>(setter: (v: T) => void) => (v: T) => { setter(v); showSaved(); };

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSettings(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, closeSettings]);

  const isRtl = language === 'ar';

  const PREVIEW_DATE = '2024-07-28T10:30:00Z';
  const PREVIEW_NUM  = 1234567.89;

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex" aria-modal="true" role="dialog" aria-label={t('settings.title')}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeSettings}
        aria-hidden="true"
      />

      {/* Drawer panel — slides from the end (left in RTL, right in LTR) */}
      <div
        className={cn(
          'relative ms-auto w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-modal flex flex-col animate-slide-in-right',
          'overflow-hidden',
        )}
      >
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 dark:border-slate-700 flex-shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-600 dark:text-primary-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-extrabold text-surface-900 dark:text-white">{t('settings.title')}</h2>
          </div>
          <div className="flex items-center gap-2">
            {savedBanner && (
              <span className="text-xs font-semibold text-success-700 bg-success-50 dark:bg-success-900/30 dark:text-success-300 px-3 py-1.5 rounded-full animate-fade-in">
                ✓ {t('settings.saveSuccess')}
              </span>
            )}
            <button
              onClick={closeSettings}
              className="p-2 rounded-xl text-surface-400 hover:bg-surface-100 dark:hover:bg-slate-800 hover:text-surface-700 dark:hover:text-white transition-colors"
              aria-label={t('common.close')}
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Scrollable body ─────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* ── APPEARANCE ─────────────────────────────────────────────────── */}
          <Section title={t('settings.appearance')} icon="🎨">
            {/* Theme */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-surface-600 dark:text-slate-400">{t('settings.theme')}</p>
              <SegmentedControl<Theme>
                id="setting-theme"
                value={theme}
                onChange={wrap(setTheme)}
                options={[
                  { value: 'light',  label: `☀️ ${t('settings.themeLight')}` },
                  { value: 'dark',   label: `🌙 ${t('settings.themeDark')}` },
                  { value: 'system', label: `💻 ${t('settings.themeSystem')}` },
                ]}
              />
            </div>

            {/* Font size */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-surface-600 dark:text-slate-400">{t('settings.fontSize')}</p>
              <RadioCards<FontSize>
                value={fontSize}
                onChange={wrap(setFontSize)}
                cols={2}
                options={[
                  { value: 'sm', label: t('settings.fontSizeSm'), preview: 'أ A' },
                  { value: 'md', label: t('settings.fontSizeMd'), preview: 'أ A' },
                  { value: 'lg', label: t('settings.fontSizeLg'), preview: 'أ A' },
                  { value: 'xl', label: t('settings.fontSizeXl'), preview: 'أ A' },
                ]}
              />
            </div>
          </Section>

          {/* ── LANGUAGE & REGION ──────────────────────────────────────────── */}
          <Section title={t('settings.language')} icon="🌐">
            {/* Language */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-surface-600 dark:text-slate-400">{t('settings.languageLabel')}</p>
              <RadioCards<Language>
                value={language}
                onChange={wrap(setLanguage)}
                cols={2}
                options={[
                  { value: 'ar', label: 'العربية', preview: 'ع' },
                  { value: 'en', label: 'English',  preview: 'A' },
                ]}
              />
            </div>

            {/* Number system */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-surface-600 dark:text-slate-400">{t('settings.numberSystem')}</p>
              <RadioCards<NumberSystem>
                value={numberSystem}
                onChange={wrap(setNumberSystem)}
                cols={2}
                options={[
                  { value: 'arabic',  label: t('settings.numberArabic'),  preview: '١٢٣' },
                  { value: 'western', label: t('settings.numberWestern'), preview: '123' },
                ]}
              />
            </div>

            {/* Date format */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-surface-600 dark:text-slate-400">{t('settings.dateFormat')}</p>
              <RadioCards<DateFormat>
                value={dateFormat}
                onChange={wrap(setDateFormat)}
                cols={3}
                options={[
                  { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY', preview: '28/07' },
                  { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY', preview: '07/28' },
                  { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD', preview: '2024' },
                ]}
              />
            </div>

            {/* Currency symbol toggle */}
            <ToggleRow
              id="setting-currency"
              label={t('settings.showCurrency')}
              checked={showCurrencySymbol}
              onChange={wrap(setShowCurrencySymbol)}
            />

            {/* Live preview box */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-surface-200 dark:border-slate-600 p-4 space-y-2">
              <p className="text-xs font-bold text-surface-500 dark:text-slate-400 uppercase tracking-wide">{t('settings.preview')}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-surface-400 dark:text-slate-500">{t('settings.numberPreview')}</p>
                  <p className="font-bold text-surface-900 dark:text-white mt-0.5">{formatCurrency(PREVIEW_NUM)}</p>
                  <p className="text-surface-600 dark:text-slate-300 text-xs mt-0.5">{formatNumber(PREVIEW_NUM, 2)}</p>
                </div>
                <div>
                  <p className="text-xs text-surface-400 dark:text-slate-500">{t('settings.datePreview')}</p>
                  <p className="font-bold text-surface-900 dark:text-white mt-0.5">{formatDate(PREVIEW_DATE)}</p>
                </div>
              </div>
            </div>
          </Section>

          {/* ── NOTIFICATIONS ──────────────────────────────────────────────── */}
          <Section title={t('settings.notifications')} icon="🔔">
            <ToggleRow
              id="setting-notif-enabled"
              label={t('settings.notificationsEnabled')}
              description={language === 'ar' ? 'استلم إشعارات فورية عند وصول أحداث مهمة' : 'Receive live alerts for important events'}
              checked={notificationsEnabled}
              onChange={wrap(setNotificationsEnabled)}
            />
            <ToggleRow
              id="setting-sound"
              label={t('settings.soundEnabled')}
              description={language === 'ar' ? 'تشغيل صوت عند استلام إشعار جديد' : 'Play a sound on new notifications'}
              checked={soundEnabled}
              onChange={wrap(setSoundEnabled)}
            />
          </Section>

          {/* ── ADVANCED ───────────────────────────────────────────────────── */}
          <Section title={t('settings.advanced')} icon="⚙️">
            {/* Reset all */}
            {confirmReset ? (
              <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl p-4 space-y-3">
                <p className="text-sm text-danger-800 dark:text-danger-200 font-medium">{t('settings.resetConfirm')}</p>
                <div className={cn('flex gap-2', isRtl ? 'flex-row-reverse' : '')}>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>{t('common.cancel')}</Button>
                  <Button variant="danger" size="sm" onClick={() => { resetAll(); setConfirmReset(false); showSaved(); }}>
                    {t('settings.resetAll')}
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-surface-200 dark:border-slate-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 hover:border-danger-200 dark:hover:border-danger-700 transition-all group text-start"
              >
                <span className="text-lg group-hover:animate-bounce-in" aria-hidden="true">🔄</span>
                <div>
                  <p className="text-sm font-semibold text-surface-800 dark:text-slate-200 group-hover:text-danger-700 dark:group-hover:text-danger-300 transition-colors">{t('settings.resetAll')}</p>
                  <p className="text-xs text-surface-500 dark:text-slate-400">{language === 'ar' ? 'إرجاع كل الخيارات إلى الافتراضي' : 'Restore all options to their defaults'}</p>
                </div>
              </button>
            )}

            {/* Clear local data */}
            {confirmClear ? (
              <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-xl p-4 space-y-3">
                <p className="text-sm text-warning-800 dark:text-warning-200 font-medium">{t('settings.clearDataConfirm')}</p>
                <div className={cn('flex gap-2', isRtl ? 'flex-row-reverse' : '')}>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>{t('common.cancel')}</Button>
                  <Button variant="warning" size="sm" onClick={() => { clearLocalData(); setConfirmClear(false); showSaved(); }}>
                    {t('settings.clearData')}
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-surface-200 dark:border-slate-600 hover:bg-warning-50 dark:hover:bg-warning-900/20 hover:border-warning-200 dark:hover:border-warning-700 transition-all group text-start"
              >
                <span className="text-lg" aria-hidden="true">🗑️</span>
                <div>
                  <p className="text-sm font-semibold text-surface-800 dark:text-slate-200 group-hover:text-warning-700 dark:group-hover:text-warning-300 transition-colors">{t('settings.clearData')}</p>
                  <p className="text-xs text-surface-500 dark:text-slate-400">{language === 'ar' ? 'مسح كل البيانات المخزنة محلياً' : 'Clear all locally stored data'}</p>
                </div>
              </button>
            )}
          </Section>

          {/* Bottom spacer */}
          <div className="h-4" />
        </div>
      </div>
    </div>,
    document.body,
  );
}