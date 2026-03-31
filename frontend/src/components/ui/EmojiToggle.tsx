import { useEmoji } from '@/contexts/EmojiContext';

export function EmojiToggle() {
  const { emojisEnabled, toggleEmojis } = useEmoji();

  return (
    <button
      onClick={toggleEmojis}
      className={`relative p-1.5 rounded-lg transition-all duration-200 group ${
        emojisEnabled
          ? 'hover:bg-bg-elevated'
          : 'bg-bg-elevated ring-1 ring-border'
      }`}
      aria-label={emojisEnabled ? 'Отключить эмодзи' : 'Включить эмодзи'}
      title={emojisEnabled ? 'Отключить эмодзи' : 'Включить эмодзи'}
    >
      <img
        src="/images/emoji-toggle.png"
        alt=""
        className={`w-5 h-5 object-contain transition-all duration-200 ${
          emojisEnabled ? 'opacity-80 group-hover:opacity-100' : 'opacity-30 grayscale'
        }`}
      />
      {!emojisEnabled && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-5 h-[2px] bg-error/70 rotate-45 rounded-full" />
        </span>
      )}
    </button>
  );
}
