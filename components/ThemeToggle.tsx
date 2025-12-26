'use client';

import { useTheme } from '@/lib/ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="tv-btn tv-btn-ghost p-2 relative"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-4 h-4">
        {/* Sun icon for light mode */}
        <Sun
          className={`w-4 h-4 absolute inset-0 transition-all duration-200 ${
            theme === 'dark'
              ? 'opacity-0 rotate-90 scale-0'
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        {/* Moon icon for dark mode */}
        <Moon
          className={`w-4 h-4 absolute inset-0 transition-all duration-200 ${
            theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
    </button>
  );
}
