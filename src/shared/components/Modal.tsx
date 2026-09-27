import { useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/utils/cn';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  className?: string;
}

const sizeClasses: Record<ModalProps['size'], string> = {
  sm:   'max-w-sm',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  full: 'max-w-full',
};

const sizeMaxWidths: Record<ModalProps['size'], React.CSSProperties> = {
  sm:   { maxWidth: 'min(420px, calc(100vw - 2rem))' },
  md:   { maxWidth: 'min(640px, calc(100vw - 2rem))' },
  lg:   { maxWidth: 'min(900px, calc(100vw - 2rem))' },
  xl:   { maxWidth: 'min(1200px, calc(100vw - 2rem))' },
  full: { maxWidth: 'calc(100vw - 1rem)' },
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  className,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-wrapper overscroll-contain"
      style={{
        padding: 'max(0.5rem, env(safe-area-inset-top)) max(0.5rem, env(safe-area-inset-right)) max(0.5rem, env(safe-area-inset-bottom)) max(0.5rem, env(safe-area-inset-left))',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'relative w-full bg-white dark:bg-slate-900 shadow-modal flex flex-col animate-scale-in border border-surface-100 dark:border-slate-800',
          sizeClasses[size],
          className,
        )}
        style={{
          ...sizeMaxWidths[size],
          maxHeight: 'clamp(300px, calc(100dvh - 2rem), calc(100dvh - 2rem))',
          borderRadius: 'clamp(0.75rem, 0.65rem + 0.5vw, 1.5rem)',
        }}
      >
        {/* Header */}
        {title && (
          <div
            className="flex items-center justify-between border-b border-surface-100 dark:border-slate-800 flex-shrink-0"
            style={{
              paddingLeft: 'clamp(0.75rem, 0.6rem + 0.8vw, 1.5rem)',
              paddingRight: 'clamp(0.5rem, 0.35rem + 0.8vw, 1.25rem)',
              paddingTop: 'clamp(0.75rem, 0.6rem + 0.5vw, 1.25rem)',
              paddingBottom: 'clamp(0.75rem, 0.6rem + 0.5vw, 1.25rem)',
              gap: 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)',
            }}
          >
            <h2
              id="modal-title"
              className="font-bold text-surface-900 dark:text-white min-w-0 flex-1 truncate"
              style={{ fontSize: 'clamp(0.9rem, 0.8rem + 0.5vw, 1.125rem)' }}
            >
              {title}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="إغلاق النافذة"
              className="rounded-lg flex-shrink-0"
              style={{ marginInlineEnd: `calc(${size === 'sm' ? '0' : '0'})` }}
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                style={{
                  width: 'clamp(18px, 16px + 0.5vw, 22px)',
                  height: 'clamp(18px, 16px + 0.5vw, 22px)',
                }}
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </Button>
          </div>
        )}

        {/* Body */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain text-surface-800 dark:text-slate-200"
          style={{
            paddingLeft: 'clamp(0.75rem, 0.6rem + 0.8vw, 1.5rem)',
            paddingRight: 'clamp(0.75rem, 0.6rem + 0.8vw, 1.5rem)',
            paddingTop: 'clamp(0.75rem, 0.6rem + 0.5vw, 1.5rem)',
            paddingBottom: 'clamp(0.75rem, 0.6rem + 0.5vw, 1.5rem)',
            fontSize: 'clamp(0.75rem, 0.7rem + 0.3vw, 0.875rem)',
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="flex-shrink-0 border-t border-surface-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-end"
            style={{
              paddingLeft: 'clamp(0.75rem, 0.6rem + 0.8vw, 1.5rem)',
              paddingRight: 'clamp(0.75rem, 0.6rem + 0.8vw, 1.5rem)',
              paddingTop: 'clamp(0.5rem, 0.4rem + 0.5vw, 1rem)',
              paddingBottom: 'clamp(0.5rem, 0.4rem + 0.5vw, 1rem)',
              gap: 'clamp(0.375rem, 0.3rem + 0.4vw, 0.75rem)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
