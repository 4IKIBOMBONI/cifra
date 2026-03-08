import { clsx } from 'clsx';
import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label className="block text-sm font-medium text-text-secondary">{label}</label>}
        <input
          ref={ref}
          className={clsx(
            'input-field',
            error && 'border-error focus:border-error focus:ring-error',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
