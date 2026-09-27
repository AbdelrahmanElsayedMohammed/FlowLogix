import { type ReactNode, type ThHTMLAttributes, type TdHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';
import { useFormatters } from '@/shared/hooks/useFormatters';
import { Spinner } from './Spinner';

// ─── Table root ───────────────────────────────────────────────────────────────
interface TableProps {
  children: ReactNode;
  className?: string;
}
export function Table({ children, className }: TableProps) {
  return (
    <div
      className={cn(
        'w-full rounded-2xl border border-surface-100 dark:border-slate-700 bg-white dark:bg-slate-900',
        'table-scroll-container',
        '-webkit-overflow-scrolling-touch',
        className,
      )}
    >
      <table className="w-full border-collapse" style={{ fontSize: 'clamp(0.7rem, 0.65rem + 0.3vw, 0.875rem)' }}>
        {children}
      </table>
    </div>
  );
}

// ─── Thead / Tbody ─────────────────────────────────────────────────────────────
export function Thead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-surface-50 dark:bg-slate-800/80 border-b border-surface-100 dark:border-slate-700">
      {children}
    </thead>
  );
}
export function Tbody({ children }: { children: ReactNode }) {
  return (
    <tbody className="divide-y divide-surface-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
      {children}
    </tbody>
  );
}
export function Tr({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr
      className={cn(
        'transition-colors',
        onClick && 'cursor-pointer hover:bg-surface-50 dark:hover:bg-slate-800/50',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

// ─── Th / Td ─────────────────────────────────────────────────────────────────
type ThProps = ThHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode };
export function Th({ children, className, ...props }: ThProps) {
  return (
    <th
      className={cn(
        'text-start font-bold text-surface-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap',
        className,
      )}
      style={{
        paddingLeft: 'clamp(0.5rem, 0.4rem + 0.5vw, 1rem)',
        paddingRight: 'clamp(0.5rem, 0.4rem + 0.5vw, 1rem)',
        paddingTop: 'clamp(0.5rem, 0.4rem + 0.4vw, 0.75rem)',
        paddingBottom: 'clamp(0.5rem, 0.4rem + 0.4vw, 0.75rem)',
        fontSize: 'clamp(0.6rem, 0.55rem + 0.2vw, 0.75rem)',
      }}
      {...props}
    >
      {children}
    </th>
  );
}

type TdProps = TdHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode };
export function Td({ children, className, ...props }: TdProps) {
  return (
    <td
      className={cn('text-surface-800 dark:text-slate-200 whitespace-nowrap', className)}
      style={{
        paddingLeft: 'clamp(0.5rem, 0.4rem + 0.5vw, 1rem)',
        paddingRight: 'clamp(0.5rem, 0.4rem + 0.5vw, 1rem)',
        paddingTop: 'clamp(0.5rem, 0.4rem + 0.4vw, 0.75rem)',
        paddingBottom: 'clamp(0.5rem, 0.4rem + 0.4vw, 0.75rem)',
      }}
      {...props}
    >
      {children}
    </td>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
export function TableSkeleton({ cols, rows = 5 }: { cols: number; rows?: number }) {
  return (
    <Tbody>
      {Array.from({ length: rows }).map((_, ri) => (
        <Tr key={ri}>
          {Array.from({ length: cols }).map((_, ci) => (
            <Td key={ci}>
              <div
                className="h-4 bg-surface-200 dark:bg-slate-700 rounded animate-pulse"
                style={{ width: `${60 + Math.random() * 30}%` }}
              />
            </Td>
          ))}
        </Tr>
      ))}
    </Tbody>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
export function TableEmpty({ cols, message }: { cols: number; message?: string }) {
  const { t } = useTranslation();
  const displayMsg = message ?? t('common.noData');

  return (
    <Tbody>
      <Tr>
        <td colSpan={cols} style={{ paddingTop: 'clamp(2rem, 1.5rem + 3vw, 4rem)', paddingBottom: 'clamp(2rem, 1.5rem + 3vw, 4rem)' }}>
          <div
            className="flex flex-col items-center"
            style={{ gap: 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)' }}
          >
            <svg
              className="text-surface-300 dark:text-slate-600"
              style={{
                width: 'clamp(2rem, 1.75rem + 2vw, 2.5rem)',
                height: 'clamp(2rem, 1.75rem + 2vw, 2.5rem)',
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m4 4h8" />
            </svg>
            <p
              className="font-medium text-surface-400 dark:text-slate-500"
              style={{ fontSize: 'clamp(0.7rem, 0.65rem + 0.3vw, 0.875rem)' }}
            >
              {displayMsg}
            </p>
          </div>
        </td>
      </Tr>
    </Tbody>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
interface PaginationProps {
  page: number;         // 0-based
  totalPages: number;
  totalElements: number;
  size: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}
export function Pagination({ page, totalPages, totalElements, size, onPageChange, isLoading }: PaginationProps) {
  const { t } = useTranslation();
  const { formatNumber } = useFormatters();

  const start = page * size + 1;
  const end = Math.min((page + 1) * size, totalElements);
  return (
    <div
      className="flex items-center justify-between border-t border-surface-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl flex-col sm:flex-row"
      style={{
        paddingLeft: 'clamp(0.5rem, 0.4rem + 0.5vw, 1rem)',
        paddingRight: 'clamp(0.5rem, 0.4rem + 0.5vw, 1rem)',
        paddingTop: 'clamp(0.5rem, 0.4rem + 0.4vw, 0.75rem)',
        paddingBottom: 'clamp(0.5rem, 0.4rem + 0.4vw, 0.75rem)',
        gap: 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)',
      }}
    >
      <p
        className="text-surface-500 dark:text-slate-400 text-center sm:text-start"
        style={{ fontSize: 'clamp(0.65rem, 0.6rem + 0.2vw, 0.875rem)' }}
      >
        {t('common.showing')} {formatNumber(start)}–{formatNumber(end)} {t('common.of')} {formatNumber(totalElements)} {t('common.results')}
      </p>
      <div className="flex items-center" style={{ gap: 'clamp(0.25rem, 0.2rem + 0.3vw, 0.5rem)' }}>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0 || isLoading}
          className="rounded-lg border border-surface-200 dark:border-slate-700 hover:bg-surface-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-surface-700 dark:text-slate-300 touch-manipulation min-touch-sm"
          style={{
            paddingLeft: 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)',
            paddingRight: 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)',
            paddingTop: 'clamp(0.25rem, 0.2rem + 0.3vw, 0.375rem)',
            paddingBottom: 'clamp(0.25rem, 0.2rem + 0.3vw, 0.375rem)',
            fontSize: 'clamp(0.7rem, 0.65rem + 0.3vw, 0.875rem)',
            minHeight: '40px',
          }}
          aria-label={t('common.back')}
        >
          &#8249;
        </button>
        <span
          className="font-medium text-surface-700 dark:text-slate-300 whitespace-nowrap px-2"
          style={{ fontSize: 'clamp(0.7rem, 0.65rem + 0.3vw, 0.875rem)' }}
        >
          {formatNumber(page + 1)} / {formatNumber(totalPages)}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1 || isLoading}
          className="rounded-lg border border-surface-200 dark:border-slate-700 hover:bg-surface-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-surface-700 dark:text-slate-300 touch-manipulation min-touch-sm"
          style={{
            paddingLeft: 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)',
            paddingRight: 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)',
            paddingTop: 'clamp(0.25rem, 0.2rem + 0.3vw, 0.375rem)',
            paddingBottom: 'clamp(0.25rem, 0.2rem + 0.3vw, 0.375rem)',
            fontSize: 'clamp(0.7rem, 0.65rem + 0.3vw, 0.875rem)',
            minHeight: '40px',
          }}
          aria-label={t('common.next')}
        >
          &#8250;
        </button>
        {isLoading && <Spinner size="sm" />}
      </div>
    </div>
  );
}
