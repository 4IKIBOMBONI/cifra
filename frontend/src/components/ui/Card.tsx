import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card({ children, className, hover = true, padding = 'md', onClick, style }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-bg-surface rounded-lg border border-border transition-all duration-200',
        hover && 'hover:border-primary/25 hover:shadow-card cursor-pointer',
        {
          'p-0': padding === 'none',
          'p-3': padding === 'sm',
          'p-5': padding === 'md',
          'p-6': padding === 'lg',
        },
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
