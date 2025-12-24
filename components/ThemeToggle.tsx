'use client';

import { useTheme } from '@/lib/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-dark-border dark:bg-dark-card rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-stock-up focus:ring-offset-2 focus:ring-offset-dark-bg"
      aria-label="테마 전환"
    >
      <div
        className={`absolute top-1 left-1 w-5 h-5 bg-white dark:bg-dark-bg rounded-full transition-transform duration-300 flex items-center justify-center ${
          theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {theme === 'dark' ? (
          <span className="text-xs">🌙</span>
        ) : (
          <span className="text-xs">☀️</span>
        )}
      </div>
    </button>
  );
}
