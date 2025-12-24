'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Stock } from './types';

interface WatchlistContextType {
  watchlist: Stock[];
  addToWatchlist: (stock: Stock) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 로컬스토리지에서 관심종목 불러오기
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error('Failed to parse watchlist from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // 관심종목 변경 시 로컬스토리지에 저장
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist, mounted]);

  const addToWatchlist = (stock: Stock) => {
    setWatchlist((prev) => {
      // 이미 있는지 확인
      if (prev.some((s) => s.symbol === stock.symbol)) {
        return prev;
      }
      return [...prev, stock];
    });
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((s) => s.symbol !== symbol));
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.some((s) => s.symbol === symbol);
  };

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
