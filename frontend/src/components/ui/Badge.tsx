import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'primary', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'badge',
        {
          'bg-primary/15 text-primary-light': variant === 'primary',
          'bg-success/15 text-success': variant === 'success',
          'bg-warning/15 text-warning': variant === 'warning',
          'bg-error/15 text-error': variant === 'error',
          'bg-info/15 text-info': variant === 'info',
          'bg-bg-elevated text-text-secondary': variant === 'neutral',
        },
        {
          'text-xs px-2 py-0.5': size === 'sm',
          'text-sm px-3 py-1': size === 'md',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
