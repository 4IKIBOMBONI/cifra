import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
        'active:scale-[0.98]',
        {
          'bg-primary hover:bg-primary-dark text-white shadow-sm hover:shadow-glow': variant === 'primary',
          'bg-bg-elevated hover:bg-bg-hover text-text-primary border border-border hover:border-border-light': variant === 'secondary',
          'text-text-secondary hover:text-text-primary hover:bg-bg-elevated': variant === 'ghost',
          'bg-error/10 text-error hover:bg-error/20 border border-error/20': variant === 'danger',
          'bg-success/10 text-success hover:bg-success/20 border border-success/20': variant === 'success',
        },
        {
          'px-2.5 py-1 text-xs gap-1': size === 'xs',
          'px-3.5 py-2 text-sm gap-1.5': size === 'sm',
          'px-5 py-2.5 text-sm gap-2': size === 'md',
          'px-6 py-3 text-base gap-2': size === 'lg',
        },
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
