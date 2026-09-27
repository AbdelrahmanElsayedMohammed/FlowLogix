import { type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles: Record<'none' | 'sm' | 'md' | 'lg', React.CSSProperties> = {
  none: {},
  sm: {
    padding: 'clamp(0.5rem, 0.4rem + 0.5vw, 1rem)',
  },
  md: {
    padding: 'clamp(0.75rem, 0.6rem + 0.8vw, 1.5rem)',
  },
  lg: {
    padding: 'clamp(1rem, 0.8rem + 1.2vw, 2rem)',
  },
};

export function Card({ children, className, onClick, padding = 'md', style }: CardProps & { style?: React.CSSProperties }) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 rounded-2xl border border-surface-100 dark:border-slate-800 shadow-card w-full max-w-full',
        onClick && 'cursor-pointer hover:shadow-card-hover transition-all duration-200',
        className,
      )}
      onClick={onClick}
      style={{
        ...paddingStyles[padding],
        borderRadius: 'clamp(0.75rem, 0.65rem + 0.5vw, 1.5rem)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: number; label: string; positive: boolean };
  accentColor?: string;
  className?: string;
}

export function MetricCard({ title, value, subtitle, icon, trend, accentColor = 'bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-300', className }: MetricCardProps) {
  return (
    <Card className={cn('relative overflow-hidden', className)} padding="md">
      <div
        className="absolute rounded-full opacity-10 bg-primary-400 blur-2xl pointer-events-none"
        aria-hidden="true"
        style={{
          top: 'clamp(-1.5rem, -2rem + 1vw, -1rem)',
          insetInlineEnd: 'clamp(-1.5rem, -2rem + 1vw, -1rem)',
          width: 'clamp(4rem, 3.5rem + 3vw, 6rem)',
          height: 'clamp(4rem, 3.5rem + 3vw, 6rem)',
        }}
      />
      <div
        className="flex items-start justify-between w-full"
        style={{ gap: 'clamp(0.5rem, 0.4rem + 0.5vw, 1rem)' }}
      >
        <div className="flex-1 min-w-0">
          <p
            className="font-medium text-surface-500 dark:text-slate-400 truncate"
            style={{ fontSize: 'clamp(0.7rem, 0.65rem + 0.3vw, 0.875rem)' }}
          >
            {title}
          </p>
          <p
            className="font-extrabold text-surface-900 dark:text-white tracking-tight"
            style={{
              marginTop: 'clamp(0.125rem, 0.1rem + 0.3vw, 0.375rem)',
              fontSize: 'clamp(1.25rem, 1rem + 2vw, 2rem)',
              lineHeight: 1.2,
            }}
          >
            {value}
          </p>
          {subtitle && (
            <p
              className="text-surface-400 dark:text-slate-500"
              style={{
                marginTop: 'clamp(0.125rem, 0.1rem + 0.1vw, 0.25rem)',
                fontSize: 'clamp(0.625rem, 0.6rem + 0.2vw, 0.75rem)',
              }}
            >
              {subtitle}
            </p>
          )}
          {trend && (
            <p
              className={cn(
                'font-semibold',
                trend.positive ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400',
              )}
              style={{
                marginTop: 'clamp(0.25rem, 0.2rem + 0.3vw, 0.5rem)',
                fontSize: 'clamp(0.625rem, 0.6rem + 0.2vw, 0.75rem)',
              }}
            >
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn('flex-shrink-0 flex items-center justify-center rounded-xl', accentColor)}
            style={{
              width: 'clamp(2.25rem, 2rem + 1.5vw, 3rem)',
              height: 'clamp(2.25rem, 2rem + 1.5vw, 3rem)',
              fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)',
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
