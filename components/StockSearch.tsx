'use client';

import { useState } from 'react';
import { Stock } from '@/lib/types';
import { useWatchlist } from '@/lib/WatchlistProvider';
import { mockTrendingStocks } from '@/data/mockData';

export default function StockSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { addToWatchlist, isInWatchlist } = useWatchlist();

  // 간단한 검색 로직 (실제로는 API 호출)
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim().length < 1) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // 목업 데이터에서 검색 (실제로는 API 호출)
    setTimeout(() => {
      const results = mockTrendingStocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const handleAddToWatchlist = (stock: Stock) => {
    addToWatchlist(stock);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="종목 검색 (심볼 또는 이름)"
          className="w-full px-4 py-2 pl-10 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stock-up transition-colors"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* 검색 결과 드롭다운 */}
      {searchQuery && (
        <div className="absolute z-10 w-full mt-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              검색 중...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((stock) => {
                const isPositive = stock.change_percent >= 0;
                const changeColor = isPositive ? 'text-stock-up' : 'text-stock-down';
                const alreadyAdded = isInWatchlist(stock.symbol);

                return (
                  <button
                    key={stock.symbol}
                    onClick={() => !alreadyAdded && handleAddToWatchlist(stock)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors flex items-center justify-between ${
                      alreadyAdded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    disabled={alreadyAdded}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {stock.symbol}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {stock.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-900 dark:text-white font-semibold">
                          ${stock.price.toFixed(2)}
                        </span>
                        <span className={`font-semibold ${changeColor}`}>
                          {isPositive ? '+' : ''}
                          {stock.change_percent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    {alreadyAdded ? (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        이미 추가됨
                      </span>
                    ) : (
                      <span className="text-stock-up text-sm">+ 추가</span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              검색 결과가 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  );
}
