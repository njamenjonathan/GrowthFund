import { RefObject, useEffect } from 'react';

/**
 * Closes a popover when the user clicks outside it or presses Escape.
 * The navbar dropdown previously stayed open until you clicked the trigger
 * again, so it hung over the page while you tried to use it.
 */
export const useDismissable = (
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void,
): void => {
  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [ref, isOpen, onClose]);
};
