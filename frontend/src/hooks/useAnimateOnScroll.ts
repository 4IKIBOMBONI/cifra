import { useEffect, useRef, useState } from 'react';

interface UseAnimateOnScrollOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useAnimateOnScroll<T extends HTMLElement = HTMLDivElement>(
  options: UseAnimateOnScrollOptions = {}
) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(element);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

export function useStaggeredAnimation(itemCount: number, baseDelay = 80) {
  const { ref, isVisible } = useAnimateOnScroll<HTMLDivElement>();

  const getItemStyle = (index: number): React.CSSProperties => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.4s ease-out ${index * baseDelay}ms, transform 0.4s ease-out ${index * baseDelay}ms`,
  });

  return { ref, isVisible, getItemStyle };
}
