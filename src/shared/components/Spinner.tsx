import { cn } from '@/shared/utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' };
const borderSizes = { sm: 'border-2', md: 'border-2', lg: 'border-3', xl: 'border-4' };

export function Spinner({ size = 'md', className, label = 'جارٍ التحميل...' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block rounded-full border-primary-200 border-t-primary-600 animate-spin',
        sizes[size],
        borderSizes[size],
        className,
      )}
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <Spinner size="xl" />
    </div>
  );
}
