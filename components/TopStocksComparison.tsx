'use client';

import { Stock } from '@/lib/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TopStocksComparisonProps {
  stocks: Stock[];
}

export default function TopStocksComparison({ stocks }: TopStocksComparisonProps) {
  const router = useRouter();
  const [hoveredStock, setHoveredStock] = useState<string | null>(null);

  // TOP 3만 가져오기
  const top3Stocks = stocks.slice(0, 3);

  // 순위별 뱃지 색상
  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-600 to-orange-700 text-white';
      default:
        return 'bg-gray-700 text-white';
    }
  };

  // 순위별 테두리 색상
  const getRankBorderColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-yellow-500/50 hover:border-yellow-500';
      case 2:
        return 'border-gray-400/50 hover:border-gray-400';
      case 3:
        return 'border-orange-600/50 hover:border-orange-600';
      default:
        return 'border-dark-border hover:border-stock-up/50';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {top3Stocks.map((stock) => {
        const isPositive = stock.change_percent >= 0;
        const changeColor = isPositive ? 'text-stock-up' : 'text-stock-down';
        const isHovered = hoveredStock === stock.symbol;

        return (
          <div
            key={stock.symbol}
            className={`
              bg-dark-card border-2 rounded-lg p-6
              transition-all duration-300 cursor-pointer
              transform hover:scale-105 hover:shadow-xl
              ${getRankBorderColor(stock.rank)}
              ${isHovered ? 'shadow-2xl' : ''}
            `}
            onMouseEnter={() => setHoveredStock(stock.symbol)}
            onMouseLeave={() => setHoveredStock(null)}
            onClick={() => router.push(`/stock/${stock.symbol}`)}
          >
            {/* 순위 뱃지 */}
            <div className="flex items-center justify-between mb-4">
              <div className={`
                px-4 py-2 rounded-full font-bold text-lg
                ${getRankBadgeColor(stock.rank)}
                shadow-lg
              `}>
                #{stock.rank}
              </div>
              <div className="flex items-center gap-2">
                {stock.sources.map((source, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-dark-bg px-2 py-1 rounded text-gray-400"
                  >
                    {source === 'most_actives' ? '🔥' : source === 'day_gainers' ? '📈' : '📉'}
                  </span>
                ))}
              </div>
            </div>

            {/* 종목 정보 */}
            <div className="text-center mb-4">
              <h3 className="text-3xl font-bold text-white mb-1">
                {stock.symbol}
              </h3>
              <p className="text-sm text-gray-400 mb-3">{stock.name}</p>

              {/* 주가 */}
              <div className="mb-3">
                <p className="text-sm text-gray-500 mb-1">현재가</p>
                <p className="text-4xl font-bold text-white">
                  ${stock.price.toFixed(2)}
                </p>
              </div>

              {/* 변동률 */}
              <div className={`
                text-2xl font-bold mb-3 ${changeColor}
                flex items-center justify-center gap-2
              `}>
                <span>{isPositive ? '▲' : '▼'}</span>
                <span>{isPositive ? '+' : ''}{stock.change_percent.toFixed(2)}%</span>
              </div>
            </div>

            {/* 비교 지표 */}
            <div className="space-y-3 pt-4 border-t border-dark-border">
              {/* 거래량 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">거래량</span>
                <span className="text-sm font-semibold text-white">
                  {(stock.volume / 1000000).toFixed(1)}M
                </span>
              </div>

              {/* 시가총액 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">시가총액</span>
                <span className="text-sm font-semibold text-white">
                  ${(stock.market_cap / 1000000000).toFixed(1)}B
                </span>
              </div>

              {/* 복합 점수 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">복합 점수</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-dark-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-stock-up rounded-full transition-all duration-500"
                      style={{ width: `${stock.composite_score}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-stock-up">
                    {stock.composite_score.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* 섹터 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">섹터</span>
                <span className="text-sm font-semibold text-white">
                  {stock.sector}
                </span>
              </div>
            </div>

            {/* 호버 시 추가 정보 */}
            {isHovered && (
              <div className="mt-4 pt-4 border-t border-dark-border animate-fade-in">
                <div className="text-xs text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>거래량 점수:</span>
                    <span className="text-white font-semibold">
                      {stock.score_breakdown.volume_score.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>변동률 점수:</span>
                    <span className="text-white font-semibold">
                      {stock.score_breakdown.change_score.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>보너스 점수:</span>
                    <span className="text-white font-semibold">
                      +{stock.score_breakdown.appearance_bonus.toFixed(1)}
                    </span>
                  </div>
                </div>
                <button className="w-full mt-3 bg-stock-up hover:bg-stock-up/80 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
                  상세 보기 →
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
