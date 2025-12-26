'use client';

import { Calendar, TrendingUp, Star, Trophy, Activity, BarChart3, Info } from 'lucide-react';
import StockCard from '@/components/StockCard';
import BriefingCard from '@/components/BriefingCard';
import StockChart from '@/components/StockChart';
import TopStocksComparison from '@/components/TopStocksComparison';
import StockSearch from '@/components/StockSearch';
import Watchlist from '@/components/Watchlist';
import TrendingStocks from '@/components/TrendingStocks';
import { mockTopStock, mockTrendingStocks, mockBriefings, mockNVDAChartData } from '@/data/mockData';

export default function Home() {
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b tv-border">
        <div>
          <h1 className="text-2xl font-semibold tv-text-primary mb-1">
            Dashboard
          </h1>
          <div className="flex items-center gap-2 tv-text-tertiary">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{currentDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="tv-badge tv-badge-live">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            LIVE DATA
          </div>
        </div>
      </div>

      {/* Watchlist Section */}
      <section className="tv-card overflow-hidden">
        <div className="p-4 border-b tv-border flex items-center justify-between">
          <div className="tv-section-title">
            <Star className="w-4 h-4 tv-text-warning" />
            <span>Watchlist</span>
          </div>
          <StockSearch />
        </div>
        <div className="p-4">
          <Watchlist />
        </div>
      </section>

      {/* Featured Stock + Chart */}
      <section>
        <div className="tv-section-header">
          <div>
            <div className="tv-section-title">
              <TrendingUp className="w-4 h-4 tv-text-positive" />
              <span>Featured Stock</span>
            </div>
            <p className="tv-section-subtitle">Top pick by composite score</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Featured Stock Card */}
          <div className="lg:col-span-2">
            <StockCard stock={mockTopStock} featured={true} />
          </div>

          {/* Chart */}
          <div className="lg:col-span-3 tv-card p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium tv-text-primary">{mockTopStock.symbol}</span>
                <span className="text-xs tv-text-muted">5D</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="tv-btn tv-btn-ghost text-xs py-1 px-2">1D</button>
                <button className="tv-btn tv-btn-secondary text-xs py-1 px-2">5D</button>
                <button className="tv-btn tv-btn-ghost text-xs py-1 px-2">1M</button>
                <button className="tv-btn tv-btn-ghost text-xs py-1 px-2">3M</button>
              </div>
            </div>
            <div className="h-[280px]">
              <StockChart data={mockNVDAChartData} symbol={mockTopStock.symbol} />
            </div>
          </div>
        </div>
      </section>

      {/* TOP 3 Comparison */}
      <section>
        <div className="tv-section-header">
          <div>
            <div className="tv-section-title">
              <Trophy className="w-4 h-4 tv-text-warning" />
              <span>Top 3 Rankings</span>
            </div>
            <p className="tv-section-subtitle">Click to view details</p>
          </div>
          <span className="text-xs tv-text-muted">Ranked by composite score</span>
        </div>
        <TopStocksComparison stocks={mockTrendingStocks} />
      </section>

      {/* Trending Stocks Grid - Real API */}
      <section>
        <TrendingStocks />
      </section>

      {/* Selection Criteria */}
      <section className="tv-card overflow-hidden">
        <div className="p-4 border-b tv-border">
          <div className="tv-section-title">
            <Info className="w-4 h-4 tv-text-accent" />
            <span>Selection Criteria</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x tv-border">
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg tv-bg-secondary flex items-center justify-center">
                <Activity className="w-5 h-5 tv-text-positive" />
              </div>
              <div>
                <h4 className="text-sm font-medium tv-text-primary">Volume Score</h4>
              </div>
            </div>
            <p className="text-xs tv-text-tertiary leading-relaxed">
              Daily trading volume compared to average volume ratio
            </p>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg tv-bg-secondary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 tv-text-positive" />
              </div>
              <div>
                <h4 className="text-sm font-medium tv-text-primary">Change Score</h4>
              </div>
            </div>
            <p className="text-xs tv-text-tertiary leading-relaxed">
              Daily price change rate and directional movement
            </p>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg tv-bg-secondary flex items-center justify-center">
                <Star className="w-5 h-5 tv-text-warning" />
              </div>
              <div>
                <h4 className="text-sm font-medium tv-text-primary">Appearance Bonus</h4>
              </div>
            </div>
            <p className="text-xs tv-text-tertiary leading-relaxed">
              Extra points for appearing in multiple screener lists
            </p>
          </div>
        </div>
      </section>

      {/* Recent Briefings */}
      <section>
        <div className="tv-section-header">
          <div>
            <div className="tv-section-title">
              <BarChart3 className="w-4 h-4 tv-text-accent" />
              <span>Recent Briefings</span>
            </div>
            <p className="tv-section-subtitle">Historical market analysis</p>
          </div>
          <button className="tv-btn tv-btn-ghost text-xs">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockBriefings.map((briefing) => (
            <BriefingCard key={briefing.id} briefing={briefing} />
          ))}
        </div>
      </section>
    </div>
  );
}
