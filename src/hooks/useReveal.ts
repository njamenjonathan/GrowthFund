import { useEffect, useRef } from 'react';

/**
 * Reveals an element the first time it scrolls into view.
 * Falls back to "already visible" when IntersectionObserver is missing,
 * so content is never hidden by a failed animation.
 */
export const useReveal = <T extends HTMLElement>(options?: IntersectionObserverInit) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      node.dataset.revealed = 'true';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = 'true';
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05, ...options },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return ref;
};
