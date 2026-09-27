import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, containerClassName, className, id, ...props }, ref) => {
    const selectId = id ?? (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-semibold text-surface-700 dark:text-slate-300">
            {label}
            {props.required && <span className="text-danger-500 ms-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'block w-full rounded-xl border bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-surface-900 dark:text-slate-100 appearance-none',
              'transition-colors duration-150 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none',
              'disabled:bg-surface-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed',
              error ? 'border-danger-500 focus:border-danger-500' : 'border-surface-200 dark:border-slate-700',
              className,
            )}
            aria-invalid={!!error}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-800 text-surface-900 dark:text-slate-100">
                {opt.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-surface-400 dark:text-slate-500">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
        {error && <p className="text-xs text-danger-600 dark:text-danger-400">{error}</p>}
        {helperText && !error && <p className="text-xs text-surface-500 dark:text-slate-400">{helperText}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
