import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      containerClassName,
      className,
      id,
      style,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
    const hasLeftElement = Boolean(leftElement);
    const hasRightElement = Boolean(rightElement);

    return (
      <div className={cn('flex flex-col', containerClassName)} style={{ gap: 'clamp(0.25rem, 0.2rem + 0.2vw, 0.375rem)' }}>
        {label && (
          <label
            htmlFor={inputId}
            className="font-semibold text-surface-700 dark:text-slate-300"
            style={{ fontSize: 'clamp(0.75rem, 0.7rem + 0.3vw, 0.875rem)' }}
          >
            {label}
            {props.required && (
              <span className="text-danger-500 ms-1" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftElement && (
            <span
              className="absolute start-0 top-1/2 -translate-y-1/2 text-surface-400 dark:text-slate-500 pointer-events-none flex items-center justify-center"
              style={{
                paddingLeft: 'clamp(0.625rem, 0.55rem + 0.4vw, 0.875rem)',
                width: 'clamp(2.25rem, 2rem + 1vw, 2.75rem)',
              }}
            >
              {leftElement}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'block w-full rounded-xl border bg-white dark:bg-slate-800',
              'text-surface-900 dark:text-slate-100',
              'placeholder:text-surface-400 dark:placeholder:text-slate-500 transition-colors duration-150',
              'focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none',
              'disabled:bg-surface-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed',
              'touch-manipulation tap-highlight-transparent',
              error
                ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-400'
                : 'border-surface-200 dark:border-slate-700',
              className,
            )}
            style={{
              minHeight: 'clamp(40px, 38px + 1vh, 48px)',
              paddingInlineStart: hasLeftElement ? 'clamp(2.25rem, 2rem + 1vw, 2.75rem)' : 'clamp(0.625rem, 0.5rem + 0.8vw, 1rem)',
              paddingInlineEnd: hasRightElement ? 'clamp(2.25rem, 2rem + 1vw, 2.75rem)' : 'clamp(0.625rem, 0.5rem + 0.8vw, 1rem)',
              paddingBlock: 'clamp(0.4rem, 0.35rem + 0.3vw, 0.625rem)',
              fontSize: 'clamp(0.75rem, 0.7rem + 0.3vw, 0.875rem)',
              ...style,
            }}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {rightElement && (
            <span
              className="absolute end-0 top-1/2 -translate-y-1/2 text-surface-400 dark:text-slate-500 flex items-center justify-center"
              style={{
                paddingRight: 'clamp(0.625rem, 0.55rem + 0.4vw, 0.875rem)',
                width: 'clamp(2.25rem, 2rem + 1vw, 2.75rem)',
              }}
            >
              {rightElement}
            </span>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-danger-600 dark:text-danger-400 flex items-center"
            style={{
              gap: 'clamp(0.125rem, 0.1rem + 0.1vw, 0.25rem)',
              fontSize: 'clamp(0.625rem, 0.6rem + 0.2vw, 0.75rem)',
            }}
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              style={{
                width: 'clamp(12px, 10px + 0.5vw, 14px)',
                height: 'clamp(12px, 10px + 0.5vw, 14px)',
                flexShrink: 0,
              }}
            >
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-surface-500 dark:text-slate-400"
            style={{ fontSize: 'clamp(0.625rem, 0.6rem + 0.2vw, 0.75rem)' }}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
