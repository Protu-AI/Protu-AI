import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export function useThemeTransition() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty('--transition-duration', '200ms');
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };
}
