'use client';

import { ThemeProvider } from "@/lib/ThemeProvider";
import { WatchlistProvider } from "@/lib/WatchlistProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { TrendingUp, LayoutDashboard, Bell, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider>
      <WatchlistProvider>
        <div className="min-h-screen tv-bg-primary tv-transition-colors">
          {/* Header - TradingView Style */}
          <header className="sticky top-0 z-50 tv-bg-elevated border-b tv-border backdrop-blur-sm">
            <div className="max-w-[1800px] mx-auto">
              <div className="flex items-center justify-between h-14 px-4 lg:px-6">
                {/* Left: Logo & Nav */}
                <div className="flex items-center gap-6">
                  {/* Logo */}
                  <a href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-tv-accent flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-[15px] font-semibold tv-text-primary">
                        While You Slept
                      </span>
                      <span className="hidden lg:inline text-xs tv-text-tertiary ml-2">
                        US Market Briefing
                      </span>
                    </div>
                  </a>

                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex items-center gap-1">
                    <a
                      href="/"
                      className="tv-btn tv-btn-ghost flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </a>
                  </nav>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                  {/* Market Status Badge */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md tv-bg-secondary">
                    <span className="w-2 h-2 rounded-full bg-tv-positive animate-pulse-live"></span>
                    <span className="text-xs font-medium tv-text-secondary">Market Closed</span>
                  </div>

                  {/* Notifications */}
                  <button
                    className="tv-btn tv-btn-ghost p-2"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                  </button>

                  {/* Theme Toggle */}
                  <ThemeToggle />

                  {/* Generate Briefing CTA */}
                  <button className="hidden sm:flex tv-btn tv-btn-primary">
                    Generate Briefing
                  </button>

                  {/* Mobile Menu Toggle */}
                  <button
                    className="md:hidden tv-btn tv-btn-ghost p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                  >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Mobile Navigation */}
              {mobileMenuOpen && (
                <div className="md:hidden border-t tv-border animate-fade-in">
                  <nav className="flex flex-col p-4 gap-2">
                    <a
                      href="/"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg tv-bg-secondary tv-text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span className="font-medium">Dashboard</span>
                    </a>
                    <button className="flex items-center justify-center gap-2 mt-2 tv-btn tv-btn-primary w-full py-3">
                      Generate Briefing
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-[1800px] mx-auto px-4 lg:px-6 py-6">
            {children}
          </main>

          {/* Footer - Minimal TradingView Style */}
          <footer className="border-t tv-border mt-12">
            <div className="max-w-[1800px] mx-auto px-4 lg:px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs tv-text-muted">
                    2024 While You Slept
                  </span>
                  <span className="hidden sm:inline text-xs tv-text-muted">|</span>
                  <span className="text-xs tv-text-muted">
                    Data provided for informational purposes only
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-xs tv-text-tertiary hover:tv-text-primary tv-transition-colors">
                    Privacy
                  </a>
                  <a href="#" className="text-xs tv-text-tertiary hover:tv-text-primary tv-transition-colors">
                    Terms
                  </a>
                  <a href="#" className="text-xs tv-text-tertiary hover:tv-text-primary tv-transition-colors">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </WatchlistProvider>
    </ThemeProvider>
  );
}
