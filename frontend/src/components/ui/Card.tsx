import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = true, onClick }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-bg-surface rounded-lg border border-border p-4 transition-all duration-200',
        hover && 'hover:border-primary/30 hover:shadow-glow cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
