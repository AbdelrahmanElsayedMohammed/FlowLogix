import { type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

type BadgeVariant = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-surface-100 text-surface-700',
  primary:  'bg-primary-100 text-primary-700',
  success:  'bg-success-50 text-success-700 border border-success-200',
  danger:   'bg-danger-50 text-danger-700 border border-danger-200',
  warning:  'bg-warning-50 text-warning-700 border border-warning-200',
  info:     'bg-blue-50 text-blue-700 border border-blue-200',
  neutral:  'bg-surface-200 text-surface-600',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-surface-500',
  primary: 'bg-primary-600',
  success: 'bg-success-600',
  danger:  'bg-danger-600',
  warning: 'bg-warning-600',
  info:    'bg-blue-600',
  neutral: 'bg-surface-500',
};

export function Badge({ variant = 'default', children, className, dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
