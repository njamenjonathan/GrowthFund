import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 to `value` once it is on screen.
 * Respects the reduce-motion preference by jumping straight to the value.
 */
export const useCountUp = (value: number, enabled: boolean, durationMs = 900) => {
  const [display, setDisplay] = useState(enabled ? 0 : value);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
      else setDisplay(value);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, enabled, durationMs]);

  return display;
};
