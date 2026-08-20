import { useEffect } from 'react';

let lockCount = 0;
let savedOverflow = '';
let savedPaddingRight = '';

/**
 * Prevents the page behind an open dialog from scrolling, compensating for
 * the removed scrollbar so the layout does not jump. Reference counted so
 * two stacked dialogs do not unlock each other.
 */
export const useScrollLock = (isLocked: boolean): void => {
  useEffect(() => {
    if (!isLocked) return;

    if (lockCount === 0) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      savedOverflow = document.body.style.overflow;
      savedPaddingRight = document.body.style.paddingRight;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = savedOverflow;
        document.body.style.paddingRight = savedPaddingRight;
      }
    };
  }, [isLocked]);
};
