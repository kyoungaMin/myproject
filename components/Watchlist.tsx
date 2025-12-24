'use client';

import { useWatchlist } from '@/lib/WatchlistProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Watchlist() {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const router = useRouter();
  const [hoveredStock, setHoveredStock] = useState<string | null>(null);

  if (watchlist.length === 0) {
    return (
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          관심종목이 없습니다
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          검색하여 관심종목을 추가해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {watchlist.map((stock) => {
        const isPositive = stock.change_percent >= 0;
        const changeColor = isPositive ? 'text-stock-up' : 'text-stock-down';

        return (
          <div
            key={stock.symbol}
            className="relative bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-4 hover:border-stock-up/50 transition-all duration-200 cursor-pointer group"
            onMouseEnter={() => setHoveredStock(stock.symbol)}
            onMouseLeave={() => setHoveredStock(null)}
            onClick={() => router.push(`/stock/${stock.symbol}`)}
          >
            {/* 삭제 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFromWatchlist(stock.symbol);
              }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-200 dark:bg-dark-bg text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            >
              ×
            </button>

            {/* 종목 정보 */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {stock.symbol}
                </h3>
                <span className="text-xs bg-gray-100 dark:bg-dark-bg px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                  #{stock.rank}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {stock.name}
              </p>
            </div>

            {/* 가격 정보 */}
            <div className="space-y-2">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${stock.price.toFixed(2)}
                </p>
                <p className={`text-sm font-semibold ${changeColor}`}>
                  {isPositive ? '+' : ''}
                  {stock.change_percent.toFixed(2)}% (${Math.abs(stock.change_amount).toFixed(2)})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-light-border dark:border-dark-border text-xs">
                <div>
                  <p className="text-gray-500 dark:text-gray-500 mb-1">거래량</p>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {(stock.volume / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-500 mb-1">시가총액</p>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    ${(stock.market_cap / 1000000000).toFixed(1)}B
                  </p>
                </div>
              </div>
            </div>

            {/* 호버 시 상세 정보 툴팁 */}
            {hoveredStock === stock.symbol && (
              <div className="absolute z-10 left-0 right-0 top-full mt-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-4 shadow-xl animate-fade-in">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">섹터</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {stock.sector}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">복합 점수</span>
                    <span className="text-stock-up font-semibold">
                      {stock.composite_score.toFixed(1)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-light-border dark:border-dark-border">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      점수 세부사항
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">거래량</p>
                        <p className="text-gray-900 dark:text-white">
                          {stock.score_breakdown.volume_score.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">변동률</p>
                        <p className="text-gray-900 dark:text-white">
                          {stock.score_breakdown.change_score.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">보너스</p>
                        <p className="text-gray-900 dark:text-white">
                          {stock.score_breakdown.appearance_bonus.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 text-xs text-gray-500 dark:text-gray-400">
                    클릭하여 상세 페이지로 이동
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
