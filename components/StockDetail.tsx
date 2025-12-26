'use client';

import { useEffect, useState } from 'react';
import { getStockQuote, getHistoricalData, StockQuoteResponse, HistoricalDataResponse } from '@/lib/api';
import StockChart from './StockChart';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Building2,
  Globe,
  DollarSign,
  Activity,
  BarChart3,
  Clock,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StockDetailProps {
  symbol: string;
}

export default function StockDetail({ symbol }: StockDetailProps) {
  const router = useRouter();
  const [quote, setQuote] = useState<StockQuoteResponse | null>(null);
  const [historical, setHistorical] = useState<HistoricalDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('5d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [quoteData, historicalData] = await Promise.all([
          getStockQuote(symbol),
          getHistoricalData(symbol, selectedPeriod),
        ]);

        setQuote(quoteData);
        setHistorical(historicalData);
      } catch (err) {
        console.error('Error fetching stock detail:', err);
        setError('Failed to load stock data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, selectedPeriod]);

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header Skeleton */}
        <div className="tv-card p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-3">
              <div className="tv-skeleton h-8 w-24" />
              <div className="tv-skeleton h-4 w-48" />
            </div>
            <div className="tv-skeleton h-10 w-32 rounded-md" />
          </div>
          <div className="tv-skeleton h-12 w-40 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="tv-skeleton h-3 w-16" />
                <div className="tv-skeleton h-6 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="tv-card p-6">
          <div className="tv-skeleton h-[300px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  // Error State
  if (error || !quote) {
    return (
      <div className="tv-card p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full tv-bg-negative flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 tv-text-negative" />
          </div>
          <p className="text-sm tv-text-primary font-medium mb-2">
            {error || 'Stock data not found'}
          </p>
          <button
            onClick={() => router.back()}
            className="tv-btn tv-btn-secondary mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { info, price } = quote;
  const isPositive = (price.change_percent || 0) >= 0;
  const isNeutral = (price.change_percent || 0) === 0;
  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  const chartData = historical?.data.map((point) => ({
    date: point.date,
    price: point.close || 0,
    volume: point.volume || 0,
    change_percent: 0,
  })) || [];

  const formatNumber = (num: number | undefined | null, decimals: number = 2) => {
    if (num === undefined || num === null) return 'N/A';
    return num.toFixed(decimals);
  };

  const formatLargeNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null) return 'N/A';
    if (num >= 1000000000000) return `$${(num / 1000000000000).toFixed(2)}T`;
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatVolume = (num: number | undefined | null) => {
    if (num === undefined || num === null) return 'N/A';
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const periods = [
    { value: '1d', label: '1D' },
    { value: '5d', label: '5D' },
    { value: '1mo', label: '1M' },
    { value: '3mo', label: '3M' },
    { value: '6mo', label: '6M' },
    { value: '1y', label: '1Y' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="tv-btn tv-btn-ghost -ml-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header Card */}
      <div className="tv-card overflow-hidden">
        <div className="p-6 border-b tv-border">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            {/* Symbol & Name */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tv-text-primary tracking-tight">
                  {info.symbol}
                </h1>
                <span className="tv-badge tv-badge-neutral text-xs">
                  {info.exchange || 'N/A'}
                </span>
              </div>
              <p className="text-sm tv-text-secondary">{info.name || info.symbol}</p>
            </div>

            {/* Price & Change */}
            <div className="text-left md:text-right">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="tv-price tv-price-xl tv-text-primary">
                  ${formatNumber(price.current_price)}
                </span>
                <span className="text-sm tv-text-muted">USD</span>
              </div>
              <div className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-md
                ${isPositive ? 'tv-bg-positive' : 'tv-bg-negative'}
              `}>
                <TrendIcon className={`w-4 h-4 ${isPositive ? 'tv-text-positive' : 'tv-text-negative'}`} />
                <span className={`tv-change font-semibold ${isPositive ? 'tv-text-positive' : 'tv-text-negative'}`}>
                  {isPositive ? '+' : ''}{formatNumber(price.change_percent)}%
                </span>
                {price.change && (
                  <span className={`text-sm ${isPositive ? 'tv-text-positive' : 'tv-text-negative'}`}>
                    (${Math.abs(price.change).toFixed(2)})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x tv-border">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 tv-text-muted" />
              <span className="text-xs tv-text-tertiary uppercase tracking-wide">Volume</span>
            </div>
            <span className="tv-data-value text-lg">{formatVolume(price.volume)}</span>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 tv-text-muted" />
              <span className="text-xs tv-text-tertiary uppercase tracking-wide">Market Cap</span>
            </div>
            <span className="tv-data-value text-lg">{formatLargeNumber(info.market_cap)}</span>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 tv-text-muted" />
              <span className="text-xs tv-text-tertiary uppercase tracking-wide">Sector</span>
            </div>
            <span className="text-sm font-medium tv-text-primary">{info.sector || 'N/A'}</span>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 tv-text-muted" />
              <span className="text-xs tv-text-tertiary uppercase tracking-wide">Industry</span>
            </div>
            <span className="text-sm font-medium tv-text-primary truncate">{info.industry || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Chart Card */}
      {chartData.length > 0 && (
        <div className="tv-card overflow-hidden">
          <div className="p-4 border-b tv-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium tv-text-primary">Price Chart</span>
              <span className="text-xs tv-text-muted">{info.symbol}</span>
            </div>
            <div className="flex items-center gap-1">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`tv-btn text-xs py-1 px-2 ${
                    selectedPeriod === period.value
                      ? 'tv-btn-secondary'
                      : 'tv-btn-ghost'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4">
            <div className="h-[350px]">
              <StockChart data={chartData} symbol={info.symbol} />
            </div>
          </div>
        </div>
      )}

      {/* Price Details Card */}
      <div className="tv-card overflow-hidden">
        <div className="p-4 border-b tv-border">
          <span className="text-sm font-medium tv-text-primary">Price Details</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x tv-border">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 tv-text-muted" />
              <span className="text-xs tv-text-tertiary">Previous Close</span>
            </div>
            <span className="tv-data-value">${formatNumber(price.previous_close)}</span>
          </div>
          <div className="p-4">
            <span className="text-xs tv-text-tertiary block mb-2">Open</span>
            <span className="tv-data-value">${formatNumber(price.open_price)}</span>
          </div>
          <div className="p-4">
            <span className="text-xs tv-text-tertiary block mb-2">Day High</span>
            <span className="tv-data-value tv-text-positive">${formatNumber(price.day_high)}</span>
          </div>
          <div className="p-4">
            <span className="text-xs tv-text-tertiary block mb-2">Day Low</span>
            <span className="tv-data-value tv-text-negative">${formatNumber(price.day_low)}</span>
          </div>
        </div>
      </div>

      {/* Company Info Card */}
      <div className="tv-card overflow-hidden">
        <div className="p-4 border-b tv-border">
          <span className="text-sm font-medium tv-text-primary">Company Information</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x tv-border">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 tv-text-muted" />
              <span className="text-xs tv-text-tertiary">Exchange</span>
            </div>
            <span className="text-sm font-medium tv-text-primary">{info.exchange || 'N/A'}</span>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 tv-text-muted" />
              <span className="text-xs tv-text-tertiary">Industry</span>
            </div>
            <span className="text-sm font-medium tv-text-primary">{info.industry || 'N/A'}</span>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 tv-text-muted" />
              <span className="text-xs tv-text-tertiary">Currency</span>
            </div>
            <span className="text-sm font-medium tv-text-primary">{info.currency || 'USD'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
