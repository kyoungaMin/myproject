'use client';

import { ThemeProvider } from "@/lib/ThemeProvider";
import { WatchlistProvider } from "@/lib/WatchlistProvider";
import ThemeToggle from "@/components/ThemeToggle";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <WatchlistProvider>
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
        {/* Header */}
        <header className="border-b border-light-border dark:border-dark-border bg-light-card/50 dark:bg-dark-card/50 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                  🌙 당신이 잠든 사이
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                  미국 주식 시장 브리핑
                </p>
              </div>
              <nav className="flex items-center gap-4">
                <a
                  href="/"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  대시보드
                </a>
                <ThemeToggle />
                <button className="bg-stock-up hover:bg-stock-up/80 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  브리핑 생성
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-light-border dark:border-dark-border mt-16 transition-colors duration-300">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-500">
            <p>© 2024 당신이 잠든 사이. All rights reserved.</p>
          </div>
        </footer>
      </div>
      </WatchlistProvider>
    </ThemeProvider>
  );
}
