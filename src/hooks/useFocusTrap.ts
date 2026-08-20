import { RefObject, useEffect } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Keeps Tab focus inside an open dialog, moves focus in when it opens, and
 * restores focus to the trigger when it closes. Without this, keyboard and
 * screen-reader users tab straight out of a modal into the page behind it.
 */
export const useFocusTrap = (
  ref: RefObject<HTMLElement | null>,
  isActive: boolean,
  onEscape?: () => void,
): void => {
  useEffect(() => {
    if (!isActive) return;

    const container = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusFirst = () => {
      if (!container) return;
      const targets = container.querySelectorAll<HTMLElement>(FOCUSABLE);
      // Prefer the first non-close control so the dialog does not open
      // with the user's finger already on "dismiss".
      const target = targets[0];
      if (target) target.focus();
      else container.focus();
    };

    // Defer to let the dialog paint before we move focus.
    const raf = requestAnimationFrame(focusFirst);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onEscape) {
        event.stopPropagation();
        onEscape();
        return;
      }

      if (event.key !== 'Tab' || !container) return;

      const targets = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (targets.length === 0) return;

      const first = targets[0];
      const last = targets[targets.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      previouslyFocused?.focus?.();
    };
  }, [ref, isActive, onEscape]);
};
