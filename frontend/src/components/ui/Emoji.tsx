import { useEmoji } from '@/contexts/EmojiContext';

interface EmojiProps {
  children: string;
  fallback?: string;
  className?: string;
}

/**
 * Wraps emoji text. When emojis are disabled, shows a neutral dot
 * with the same dimensions so layout doesn't shift.
 */
export function Emoji({ children, fallback = '●', className = '' }: EmojiProps) {
  const { emojisEnabled } = useEmoji();

  return (
    <span className={`inline-flex items-center justify-center ${className}`} role="img">
      {emojisEnabled ? children : <span className="opacity-40">{fallback}</span>}
    </span>
  );
}
