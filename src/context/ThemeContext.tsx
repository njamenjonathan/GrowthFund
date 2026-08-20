import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { readStorage, writeStorage } from '../lib/storage';

export type ThemeSetting = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  /** What the user chose, including "follow the system". */
  theme: ThemeSetting;
  /** What is actually rendered right now. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeSetting) => void;
  toggleTheme: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
}

const THEME_KEY = 'growthfund_theme';
const CONTRAST_KEY = 'growthfund_high_contrast';
const MOTION_KEY = 'growthfund_reduce_motion';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const prefersDark = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeSetting>(() => {
    const saved = readStorage(THEME_KEY);
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
    return 'system';
  });

  const [systemDark, setSystemDark] = useState<boolean>(prefersDark);

  const [highContrast, setHighContrast] = useState<boolean>(
    () => readStorage(CONTRAST_KEY) === 'true',
  );

  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    const saved = readStorage(MOTION_KEY);
    if (saved === 'true') return true;
    if (saved === 'false') return false;
    return prefersReducedMotion();
  });

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  // Track the OS colour scheme so "system" stays live rather than being
  // sampled once at startup.
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    // Lets form controls, scrollbars and the caret follow the theme.
    root.style.colorScheme = resolvedTheme;

    // Keep the mobile browser chrome in step with the page.
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = resolvedTheme === 'dark' ? '#020617' : '#f8fafc';
  }, [resolvedTheme]);

  useEffect(() => {
    writeStorage(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
    writeStorage(CONTRAST_KEY, String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle('gf-reduce-motion', reduceMotion);
    writeStorage(MOTION_KEY, String(reduceMotion));
  }, [reduceMotion]);

  const setTheme = useCallback((next: ThemeSetting) => setThemeState(next), []);

  /** Cycles the resolved appearance: whatever you see now, show the other. */
  const toggleTheme = useCallback(() => {
    setThemeState(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme]);

  const toggleHighContrast = useCallback(() => setHighContrast((prev) => !prev), []);
  const toggleReduceMotion = useCallback(() => setReduceMotion((prev) => !prev), []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      highContrast,
      toggleHighContrast,
      reduceMotion,
      toggleReduceMotion,
    }),
    [
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      highContrast,
      toggleHighContrast,
      reduceMotion,
      toggleReduceMotion,
    ],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
