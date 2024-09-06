import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const getSystemTheme = () => {
      if (window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return false; 
    };

    setDarkMode(getSystemTheme());

    const mediaQueryListener = (event: MediaQueryListEvent) => {
      setDarkMode(event.matches);
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', mediaQueryListener);

    return () => {
      mediaQuery.removeEventListener('change', mediaQueryListener);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode: toggleDarkMode }}>
      <div className={darkMode ? 'dark' : ''}>
        {children}
      </div>
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
