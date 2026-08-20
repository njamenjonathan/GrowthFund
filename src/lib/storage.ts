/**
 * localStorage access that cannot throw.
 *
 * Reading or writing localStorage raises a SecurityError in Safari private
 * mode and when third-party storage is blocked in an iframe. The previous
 * code called it unguarded during render, which took the whole app down.
 */
export const readStorage = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const writeStorage = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* Storage unavailable — preferences simply do not persist. */
  }
};

export const removeStorage = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* no-op */
  }
};
