import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('growthfund_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('growthfund_high_contrast') === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('growthfund_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('growthfund_high_contrast', String(highContrast));
  }, [highContrast]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, highContrast, toggleHighContrast }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
