'use client';

import { useEffect, useState } from 'react';
import { getStockQuote, convertQuoteToStock, StockQuoteResponse } from '@/lib/api';
import StockCard from './StockCard';
import { AlertCircle, Activity } from 'lucide-react';

interface RealTimeStocksProps {
  symbols: string[];
  title?: string;
}

export default function RealTimeStocks({ symbols, title = 'Real-Time Quotes' }: RealTimeStocksProps) {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        setError(null);

        const promises = symbols.map((symbol) => getStockQuote(symbol));
        const results = await Promise.allSettled(promises);

        const successfulStocks = results
          .filter((result): result is PromiseFulfilledResult<StockQuoteResponse> =>
            result.status === 'fulfilled'
          )
          .map((result, index) => convertQuoteToStock(result.value, index + 1));

        setStocks(successfulStocks);
      } catch (err) {
        console.error('Error fetching stocks:', err);
        setError('Failed to load stock data.');
      } finally {
        setLoading(false);
      }
    };

    if (symbols.length > 0) {
      fetchStocks();
    }
  }, [symbols]);

  // Loading State
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger">
        {symbols.map((symbol, index) => (
          <div
            key={symbol}
            className="tv-card p-4 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
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
    );
  }

  // Error State
  if (error) {
    return (
      <div className="tv-card p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full tv-bg-negative flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 tv-text-negative" />
          </div>
          <p className="text-sm tv-text-primary font-medium mb-2">Connection Error</p>
          <p className="text-xs tv-text-tertiary mb-2">{error}</p>
          <p className="text-xs tv-text-muted">
            Please ensure the backend server is running.
          </p>
        </div>
      </div>
    );
  }

  // Empty State
  if (stocks.length === 0) {
    return (
      <div className="tv-card p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full tv-bg-warning flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 tv-text-warning" />
          </div>
          <p className="text-sm tv-text-primary font-medium mb-2">No Data Available</p>
          <p className="text-xs tv-text-tertiary">
            No stock data to display at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
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
  );
}
