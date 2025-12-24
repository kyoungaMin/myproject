'use client';

import StockCard from '@/components/StockCard';
import BriefingCard from '@/components/BriefingCard';
import StockChart from '@/components/StockChart';
import TopStocksComparison from '@/components/TopStocksComparison';
import StockSearch from '@/components/StockSearch';
import Watchlist from '@/components/Watchlist';
import { mockTopStock, mockTrendingStocks, mockBriefings, mockNVDAChartData } from '@/data/mockData';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mb-2">
            오늘의 대시보드
          </h2>
          <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </p>
        </div>
      </div>

      {/* Watchlist Section */}
      <section>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mb-4">
            ⭐ 관심종목
          </h3>
          <StockSearch />
        </div>
        <Watchlist />
      </section>

      {/* Featured Stock Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            🔥 오늘의 화제 종목
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            복합 점수 기준 Top 1
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StockCard stock={mockTopStock} featured={true} />
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              📈 {mockTopStock.symbol} 주가 차트
            </h4>
            <StockChart data={mockNVDAChartData} symbol={mockTopStock.symbol} />
          </div>
        </div>
      </section>

      {/* TOP 3 Comparison */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              🏆 TOP 3 종목 비교
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              클릭하여 상세 정보 확인
            </p>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            복합 점수 순위
          </span>
        </div>
        <TopStocksComparison stocks={mockTrendingStocks} />
      </section>

      {/* Trending Stocks Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            📈 화제 종목 순위
          </h3>
          <button className="text-sm text-stock-up hover:text-stock-up/80 transition-colors">
            전체 보기 →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTrendingStocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </section>

      {/* Selection Criteria */}
      <section className="bg-dark-card border border-dark-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          📊 종목 선정 기준
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-dark-bg rounded">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-1">거래량 점수</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              평균 거래량 대비 당일 거래량 비율
            </p>
          </div>
          <div className="p-4 bg-dark-bg rounded">
            <div className="text-2xl mb-2">📈</div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-1">변동률 점수</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              당일 주가 변동폭 및 방향성
            </p>
          </div>
          <div className="p-4 bg-dark-bg rounded">
            <div className="text-2xl mb-2">⭐</div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-1">출현 보너스</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              여러 스크리너 목록 동시 등장 시 가산점
            </p>
          </div>
        </div>
      </section>

      {/* Recent Briefings */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            📋 최근 브리핑 히스토리
          </h3>
          <button className="text-sm text-stock-up hover:text-stock-up/80 transition-colors">
            전체 히스토리 →
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
