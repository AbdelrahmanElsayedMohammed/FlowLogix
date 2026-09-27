import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus-visible:ring-primary-500 shadow-sm',
  secondary: 'bg-white text-primary-700 hover:bg-surface-50 border border-surface-200 focus-visible:ring-primary-400 shadow-sm',
  ghost: 'bg-transparent text-surface-700 hover:bg-surface-100 focus-visible:ring-primary-400',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-500 shadow-sm',
  warning: 'bg-warning-500 text-white hover:bg-warning-600 focus-visible:ring-warning-500 shadow-sm',
};

const sizeStyles: Record<ButtonSize, React.CSSProperties & {
  _gap?: string;
  _fontSize?: string;
}> = {
  sm: {
    minHeight: '40px',
    minWidth: '40px',
    paddingInline: 'clamp(0.5rem, 0.45rem + 0.3vw, 0.75rem)',
    paddingBlock: '0.5rem',
    _gap: 'clamp(0.25rem, 0.2rem + 0.2vw, 0.375rem)',
    _fontSize: 'clamp(0.65rem, 0.62rem + 0.2vw, 0.75rem)',
  },
  md: {
    minHeight: '44px',
    minWidth: '44px',
    paddingInline: 'clamp(0.75rem, 0.65rem + 0.5vw, 1rem)',
    paddingBlock: '0.625rem',
    _gap: 'clamp(0.375rem, 0.3rem + 0.3vw, 0.5rem)',
    _fontSize: 'clamp(0.75rem, 0.7rem + 0.3vw, 0.875rem)',
  },
  lg: {
    minHeight: '52px',
    minWidth: '52px',
    paddingInline: 'clamp(1rem, 0.85rem + 0.8vw, 1.5rem)',
    paddingBlock: '0.875rem',
    _gap: 'clamp(0.375rem, 0.3rem + 0.4vw, 0.625rem)',
    _fontSize: 'clamp(0.875rem, 0.8rem + 0.4vw, 1rem)',
  },
  xl: {
    minHeight: '60px',
    minWidth: '60px',
    paddingInline: 'clamp(1.25rem, 1rem + 1.5vw, 2rem)',
    paddingBlock: '1rem',
    _gap: 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)',
    _fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      style,
      ...props
    },
    ref,
  ) => {
    const sizeStyle = sizeStyles[size];
    const { _gap, _fontSize, ...spacingStyles } = sizeStyle;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-xl',
          'transition-all duration-200 select-none',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'touch-manipulation tap-highlight-transparent',
          variantClasses[variant],
          size === 'xl' && 'rounded-2xl',
          fullWidth && 'w-full',
          className,
        )}
        style={{
          ...spacingStyles,
          gap: _gap,
          fontSize: _fontSize,
          ...style,
        }}
        {...props}
      >
        {loading ? (
          <span
            style={{
              display: 'inline-block',
              width: 'clamp(14px, 12px + 0.5vw, 18px)',
              height: 'clamp(14px, 12px + 0.5vw, 18px)',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
            aria-hidden="true"
          />
        ) : leftIcon ? (
          <span aria-hidden="true">{leftIcon}</span>
        ) : null}
        {children}
        {!loading && rightIcon ? (
          <span aria-hidden="true">{rightIcon}</span>
        ) : null}
      </button>
    );
  },
);

Button.displayName = 'Button';
