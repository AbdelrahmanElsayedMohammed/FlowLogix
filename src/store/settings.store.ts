/**
 * settings.store.ts
 * Zustand store for all user preferences — persisted to localStorage.
 * This is the single source of truth for: theme, language, number format,
 * font size, and notification preferences.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'ar' | 'en';
export type NumberSystem = 'arabic' | 'western';
export type DateFormat = 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SettingsState {
  // Appearance
  theme: Theme;
  fontSize: FontSize;

  // Localisation
  language: Language;
  numberSystem: NumberSystem;
  dateFormat: DateFormat;
  showCurrencySymbol: boolean;

  // Notifications
  notificationsEnabled: boolean;
  soundEnabled: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setLanguage: (lang: Language) => void;
  setNumberSystem: (system: NumberSystem) => void;
  setDateFormat: (format: DateFormat) => void;
  setShowCurrencySymbol: (show: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  resetAll: () => void;
  clearLocalData: () => void;
}

const DEFAULTS = {
  theme: 'light' as Theme,
  fontSize: 'md' as FontSize,
  language: 'ar' as Language,
  numberSystem: 'arabic' as NumberSystem,
  dateFormat: 'dd/mm/yyyy' as DateFormat,
  showCurrencySymbol: true,
  notificationsEnabled: true,
  soundEnabled: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setLanguage: (language) => set({ language }),
      setNumberSystem: (numberSystem) => set({ numberSystem }),
      setDateFormat: (dateFormat) => set({ dateFormat }),
      setShowCurrencySymbol: (showCurrencySymbol) => set({ showCurrencySymbol }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),

      resetAll: () => set({ ...DEFAULTS }),

      clearLocalData: () => {
        // Clear all flowlogix-prefixed keys
        Object.keys(localStorage)
          .filter((k) => k.startsWith('flowlogix'))
          .forEach((k) => localStorage.removeItem(k));
        set({ ...DEFAULTS });
      },
    }),
    {
      name: 'flowlogix-settings',
      partialize: (state) => ({
        theme: state.theme,
        fontSize: state.fontSize,
        language: state.language,
        numberSystem: state.numberSystem,
        dateFormat: state.dateFormat,
        showCurrencySymbol: state.showCurrencySymbol,
        notificationsEnabled: state.notificationsEnabled,
        soundEnabled: state.soundEnabled,
      }),
    },
  ),
);
