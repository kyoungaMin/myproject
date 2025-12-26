'use client';

import { Stock } from '@/lib/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, Activity, BarChart3, Building2, ChevronRight } from 'lucide-react';

interface TopStocksComparisonProps {
  stocks: Stock[];
}

export default function TopStocksComparison({ stocks }: TopStocksComparisonProps) {
  const router = useRouter();
  const [hoveredStock, setHoveredStock] = useState<string | null>(null);

  const top3Stocks = stocks.slice(0, 3);

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) return `${(volume / 1000000000).toFixed(1)}B`;
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1000000000000) return `$${(cap / 1000000000000).toFixed(2)}T`;
    if (cap >= 1000000000) return `$${(cap / 1000000000).toFixed(1)}B`;
    if (cap >= 1000000) return `$${(cap / 1000000).toFixed(1)}M`;
    return `$${cap.toLocaleString()}`;
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          badge: 'tv-rank-1',
          border: 'border-l-4 border-l-yellow-500',
          glow: 'shadow-yellow-500/10',
        };
      case 2:
        return {
          badge: 'tv-rank-2',
          border: 'border-l-4 border-l-gray-400',
          glow: 'shadow-gray-400/10',
        };
      case 3:
        return {
          badge: 'tv-rank-3',
          border: 'border-l-4 border-l-orange-600',
          glow: 'shadow-orange-500/10',
        };
      default:
        return {
          badge: 'tv-badge-neutral',
          border: 'border-l-4 border-l-gray-500',
          glow: '',
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {top3Stocks.map((stock, index) => {
        const isPositive = stock.change_percent >= 0;
        const isHovered = hoveredStock === stock.symbol;
        const rankStyle = getRankStyle(stock.rank);
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;

        return (
          <div
            key={stock.symbol}
            className={`
              tv-card tv-card-interactive overflow-hidden cursor-pointer
              ${rankStyle.border}
              ${isHovered ? `shadow-tv-lg ${rankStyle.glow}` : ''}
              transition-all duration-200
              animate-slide-up
            `}
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            onMouseEnter={() => setHoveredStock(stock.symbol)}
            onMouseLeave={() => setHoveredStock(null)}
            onClick={() => router.push(`/stock/${stock.symbol}`)}
          >
            {/* Header */}
            <div className="p-4 border-b tv-border-secondary">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                    ${rankStyle.badge}
                  `}>
                    {stock.rank}
                  </div>
                  <div>
                    <span className="text-lg font-semibold tv-text-primary block">
                      {stock.symbol}
                    </span>
                    <span className="text-xs tv-text-muted truncate max-w-[120px] block">
                      {stock.name}
                    </span>
                  </div>
                </div>

                {/* Source Indicators */}
                <div className="flex gap-1">
                  {stock.sources.slice(0, 2).map((source, idx) => (
                    <span
                      key={idx}
                      className="tv-badge tv-badge-neutral text-[10px]"
                      title={source}
                    >
                      {source === 'most_actives' && 'Active'}
                      {source === 'day_gainers' && 'Gainer'}
                      {source === 'day_losers' && 'Loser'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="p-4">
              <div className="text-center mb-4">
                <span className="tv-price tv-price-xl tv-text-primary block mb-2">
                  ${stock.price.toFixed(2)}
                </span>
                <div className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md
                  ${isPositive ? 'tv-bg-positive' : 'tv-bg-negative'}
                `}>
                  <TrendIcon className={`w-4 h-4 ${isPositive ? 'tv-text-positive' : 'tv-text-negative'}`} />
                  <span className={`tv-change font-semibold ${isPositive ? 'tv-text-positive' : 'tv-text-negative'}`}>
                    {isPositive ? '+' : ''}{stock.change_percent.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2.5">
                <div className="tv-data-row">
                  <span className="tv-data-label flex items-center gap-1.5">
                    <Activity className="w-3 h-3" />
                    Volume
                  </span>
                  <span className="tv-data-value">{formatVolume(stock.volume)}</span>
                </div>

                <div className="tv-data-row">
                  <span className="tv-data-label flex items-center gap-1.5">
                    <BarChart3 className="w-3 h-3" />
                    Market Cap
                  </span>
                  <span className="tv-data-value">{formatMarketCap(stock.market_cap)}</span>
                </div>

                <div className="tv-data-row">
                  <span className="tv-data-label flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" />
                    Sector
                  </span>
                  <span className="text-xs font-medium tv-text-primary">{stock.sector}</span>
                </div>

                {/* Composite Score */}
                <div className="tv-data-row border-none">
                  <span className="tv-data-label">Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full tv-bg-tertiary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-tv-positive transition-all duration-700"
                        style={{ width: `${Math.min(stock.composite_score, 100)}%` }}
                      />
                    </div>
                    <span className="tv-data-value tv-text-positive">
                      {stock.composite_score.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Detail */}
            <div className={`
              px-4 pb-4 pt-0 transition-all duration-200
              ${isHovered ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'}
            `}>
              <div className="pt-3 border-t tv-border space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="tv-text-muted">Volume Score</span>
                  <span className="tv-text-primary font-medium">
                    {stock.score_breakdown.volume_score.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="tv-text-muted">Change Score</span>
                  <span className="tv-text-primary font-medium">
                    {stock.score_breakdown.change_score.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="tv-text-muted">Bonus</span>
                  <span className="tv-text-positive font-medium">
                    +{stock.score_breakdown.appearance_bonus.toFixed(1)}
                  </span>
                </div>
              </div>

              <button className="tv-btn tv-btn-primary w-full mt-3 text-xs">
                View Details
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
