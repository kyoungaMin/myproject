'use client';

import { useEffect, useState } from 'react';
import { getTrendingStocks, convertQuoteToStock } from '@/lib/api';
import StockCard from './StockCard';
import { RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';

export default function TrendingStocks() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStocks = async () => {
    try {
      setError(null);
      const data = await getTrendingStocks();
      const convertedStocks = data.map((quote, index) =>
        convertQuoteToStock(quote, index + 1)
      );
      setStocks(convertedStocks);
    } catch (err) {
      console.error('Error fetching trending stocks:', err);
      setError('Failed to load trending stocks data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStocks();
  };

  // Loading State
  if (loading) {
    return (
      <div>
        <div className="tv-section-header">
          <div className="tv-section-title">
            <TrendingUp className="w-4 h-4 tv-text-positive" />
            <span>Trending Stocks</span>
            <span className="tv-badge tv-badge-live ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              LIVE
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="tv-card p-4 animate-slide-up"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="tv-skeleton h-5 w-16" />
                  <div className="tv-skeleton h-3 w-24" />
                </div>
                <div className="tv-skeleton h-8 w-20 rounded-md" />
              </div>
              <div className="tv-skeleton h-8 w-28 mb-4" />
              <div className="grid grid-cols-2 gap-3">
                <div className="tv-skeleton h-4 w-full" />
                <div className="tv-skeleton h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div>
        <div className="tv-section-header">
          <div className="tv-section-title">
            <TrendingUp className="w-4 h-4 tv-text-positive" />
            <span>Trending Stocks</span>
          </div>
        </div>
        <div className="tv-card p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full tv-bg-negative flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 tv-text-negative" />
            </div>
            <p className="text-sm tv-text-primary font-medium mb-2">Unable to Load Data</p>
            <p className="text-xs tv-text-tertiary mb-4 max-w-md">{error}</p>
            <button
              onClick={handleRefresh}
              className="tv-btn tv-btn-secondary"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="tv-section-header">
        <div className="flex items-center gap-3">
          <div className="tv-section-title">
            <TrendingUp className="w-4 h-4 tv-text-positive" />
            <span>Trending Stocks</span>
          </div>
          <span className="tv-badge tv-badge-live">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            LIVE
          </span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`tv-btn ${refreshing ? 'tv-btn-ghost cursor-not-allowed opacity-50' : 'tv-btn-secondary'}`}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger">
        {stocks.map((stock, index) => (
          <div
            key={stock.symbol}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
          >
            <StockCard stock={stock} />
          </div>
        ))}
      </div>
    </div>
  );
}
