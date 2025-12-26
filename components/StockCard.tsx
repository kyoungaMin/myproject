'use client';

import { Stock } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, Minus, Activity, Building2, BarChart3 } from 'lucide-react';

interface StockCardProps {
  stock: Stock;
  featured?: boolean;
  compact?: boolean;
}

export default function StockCard({ stock, featured = false, compact = false }: StockCardProps) {
  const router = useRouter();
  const isPositive = stock.change_percent >= 0;
  const isNeutral = stock.change_percent === 0;

  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

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

  const handleClick = () => {
    router.push(`/stock/${stock.symbol}`);
  };

  if (compact) {
    return (
      <div
        onClick={handleClick}
        className="tv-card tv-card-interactive p-4 cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-sm font-semibold tv-text-primary">{stock.symbol}</span>
              <span className="text-xs tv-text-muted truncate max-w-[100px]">{stock.name}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="tv-price text-sm tv-text-primary">${stock.price.toFixed(2)}</div>
            <div className={`tv-change text-xs ${isPositive ? 'tv-change-positive' : 'tv-change-negative'}`}>
              {isPositive ? '+' : ''}{stock.change_percent.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`
        tv-card tv-card-interactive overflow-hidden cursor-pointer group
        ${featured ? 'col-span-full lg:col-span-2' : ''}
      `}
    >
      {/* Header Section */}
      <div className="p-4 pb-3 border-b tv-border-secondary">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-semibold tv-text-primary tracking-tight">
                {stock.symbol}
              </span>
              {stock.rank && (
                <span className={`
                  tv-badge text-[10px] font-bold px-2 py-0.5
                  ${stock.rank === 1 ? 'tv-rank-1' : ''}
                  ${stock.rank === 2 ? 'tv-rank-2' : ''}
                  ${stock.rank === 3 ? 'tv-rank-3' : ''}
                  ${stock.rank > 3 ? 'tv-badge-neutral' : ''}
                `}>
                  #{stock.rank}
                </span>
              )}
            </div>
            <p className="text-xs tv-text-tertiary truncate">{stock.name}</p>
          </div>

          {/* Change Badge */}
          <div className={`
            flex items-center gap-1 px-2.5 py-1.5 rounded-md
            ${isPositive ? 'tv-bg-positive' : 'tv-bg-negative'}
          `}>
            <TrendIcon className={`w-3.5 h-3.5 ${isPositive ? 'tv-text-positive' : 'tv-text-negative'}`} />
            <span className={`tv-change text-sm font-semibold ${isPositive ? 'tv-text-positive' : 'tv-text-negative'}`}>
              {isPositive ? '+' : ''}{stock.change_percent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="p-4 pb-3">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="tv-price tv-price-lg tv-text-primary">
            ${stock.price.toFixed(2)}
          </span>
          <span className="text-xs tv-text-muted">USD</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="tv-data-row border-none p-0">
            <span className="tv-data-label flex items-center gap-1.5">
              <Activity className="w-3 h-3" />
              Volume
            </span>
            <span className="tv-data-value">{formatVolume(stock.volume)}</span>
          </div>
          <div className="tv-data-row border-none p-0">
            <span className="tv-data-label flex items-center gap-1.5">
              <BarChart3 className="w-3 h-3" />
              Mkt Cap
            </span>
            <span className="tv-data-value">{formatMarketCap(stock.market_cap)}</span>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="px-4 py-3 tv-bg-secondary border-t tv-border-secondary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3 h-3 tv-text-muted" />
            <span className="text-xs tv-text-tertiary">{stock.sector}</span>
          </div>

          {stock.composite_score && (
            <div className="flex items-center gap-2">
              <span className="text-xs tv-text-muted">Score</span>
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1.5 rounded-full tv-bg-tertiary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-tv-positive transition-all duration-500"
                    style={{ width: `${Math.min(stock.composite_score, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold tv-text-positive">
                  {stock.composite_score.toFixed(0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Featured: Additional Info */}
      {featured && stock.selection_reason && (
        <div className="px-4 py-3 border-t tv-border">
          <div className="flex items-start gap-2 p-3 rounded-md tv-bg-tertiary">
            <div className="w-1 h-full min-h-[20px] rounded-full bg-tv-accent flex-shrink-0" />
            <p className="text-xs tv-text-secondary leading-relaxed">
              {stock.selection_reason}
            </p>
          </div>
        </div>
      )}

      {/* Featured: Source Tags */}
      {featured && stock.sources && stock.sources.length > 0 && (
        <div className="px-4 pb-4 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {stock.sources.map((source, idx) => (
              <span
                key={idx}
                className="tv-badge tv-badge-neutral text-[10px]"
              >
                {source}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
