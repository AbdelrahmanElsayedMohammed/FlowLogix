/**
 * cn.ts — class-name utility (clsx + tailwind-merge)
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * formatCurrency — formats a number as Egyptian Pounds
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * formatDate — formats an ISO string in Arabic locale
 */
export function formatDate(isoString: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(new Date(isoString));
}

/**
 * formatDateTime — formats an ISO string with time in Arabic
 */
export function formatDateTime(isoString: string): string {
  return formatDate(isoString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * timeAgo — relative time (e.g., "منذ 5 دقائق")
 */
export function timeAgo(isoString: string): string {
  const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' });
  const diff = (new Date(isoString).getTime() - Date.now()) / 1000;
  if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second');
  if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  return rtf.format(Math.round(diff / 86400), 'day');
}
