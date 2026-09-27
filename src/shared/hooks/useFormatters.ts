/**
 * useFormatters.ts / useFormatter.ts
 *
 * Reactive hook that returns number, currency, date, datetime, and timeAgo formatting functions.
 * All functions automatically re-render and adapt when the user changes settings in `useSettingsStore`:
 * - numberSystem: 'arabic' (٠١٢٣٤٥٦٧٨٩) vs 'western' (0123456789)
 * - dateFormat: 'dd/mm/yyyy' vs 'mm/dd/yyyy' vs 'yyyy-mm-dd'
 * - showCurrencySymbol: boolean
 * - language: 'ar' vs 'en'
 */
import { useMemo } from 'react';
import { useSettingsStore } from '@/store/settings.store';

export function useFormatters() {
  const language = useSettingsStore((s) => s.language);
  const numberSystem = useSettingsStore((s) => s.numberSystem);
  const dateFormat = useSettingsStore((s) => s.dateFormat);
  const showCurrencySymbol = useSettingsStore((s) => s.showCurrencySymbol);

  // Determine locale for number formatting
  const numberLocale = useMemo(() => {
    if (numberSystem === 'arabic') {
      return 'ar-EG-u-nu-arab';
    }
    return language === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US-u-nu-latn';
  }, [numberSystem, language]);

  const currencySymbolStr = language === 'en' ? 'EGP' : 'ج.م';

  // 1. Number formatter
  const formatNumber = (value: number, decimals = 0): string => {
    if (value === undefined || value === null || isNaN(value)) return '0';
    return new Intl.NumberFormat(numberLocale, {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(value);
  };

  // 2. Currency formatter
  const formatCurrency = (amount: number): string => {
    if (amount === undefined || amount === null || isNaN(amount)) return `0 ${currencySymbolStr}`;
    const formattedNum = new Intl.NumberFormat(numberLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    if (!showCurrencySymbol) {
      return formattedNum;
    }
    return language === 'ar' ? `${formattedNum} ${currencySymbolStr}` : `${currencySymbolStr} ${formattedNum}`;
  };

  // Helper to format digits explicitly according to number system preference
  const toDigits = (n: number, length = 2): string => {
    const str = String(n).padStart(length, '0');
    if (numberSystem === 'arabic') {
      return str.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d, 10)]);
    }
    return str;
  };

  // 3. Date Formatter
  const formatDate = (isoString: string): string => {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';

    const day = toDigits(d.getDate(), 2);
    const month = toDigits(d.getMonth() + 1, 2);
    const year = toDigits(d.getFullYear(), 4);

    switch (dateFormat) {
      case 'mm/dd/yyyy':
        return `${month}/${day}/${year}`;
      case 'yyyy-mm-dd':
        return `${year}-${month}-${day}`;
      case 'dd/mm/yyyy':
      default:
        return `${day}/${month}/${year}`;
    }
  };

  // 4. DateTime Formatter
  const formatDateTime = (isoString: string): string => {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';

    const dateFormatted = formatDate(isoString);
    const timeFormatted = d.toLocaleTimeString(numberLocale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return `${dateFormatted} ${timeFormatted}`;
  };

  // 5. Today Long Date Formatter
  const formatTodayLong = (): string => {
    return new Intl.DateTimeFormat(numberLocale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date());
  };

  // 6. Relative Time Formatter
  const timeAgo = (isoString: string): string => {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';

    const rtf = new Intl.RelativeTimeFormat(language === 'ar' ? 'ar' : 'en', { numeric: 'auto' });
    const diffSeconds = (d.getTime() - Date.now()) / 1000;

    if (Math.abs(diffSeconds) < 60) return rtf.format(Math.round(diffSeconds), 'second');
    if (Math.abs(diffSeconds) < 3600) return rtf.format(Math.round(diffSeconds / 60), 'minute');
    if (Math.abs(diffSeconds) < 86400) return rtf.format(Math.round(diffSeconds / 3600), 'hour');
    return rtf.format(Math.round(diffSeconds / 86400), 'day');
  };

  return {
    formatNumber,
    formatCurrency,
    formatDate,
    formatDateTime,
    formatTodayLong,
    timeAgo,
  };
}

export const useFormatter = useFormatters;
