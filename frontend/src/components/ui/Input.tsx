import { clsx } from 'clsx';
import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'input-field',
              icon && 'pl-10',
              error && 'border-error focus:border-error focus:ring-error/50',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-error mt-1">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted mt-1">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
