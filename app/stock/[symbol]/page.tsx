'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockStockDetails } from '@/data/mockData';
import StockChart from '@/components/StockChart';
import { useWatchlist } from '@/lib/WatchlistProvider';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const symbol = params.symbol as string;
  const stockDetail = mockStockDetails[symbol];

  if (!stockDetail) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          종목을 찾을 수 없습니다
        </h2>
        <button
          onClick={() => router.push('/')}
          className="text-stock-up hover:text-stock-up/80"
        >
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  const isPositive = stockDetail.change_percent >= 0;
  const changeColor = isPositive ? 'text-stock-up' : 'text-stock-down';
  const inWatchlist = isInWatchlist(symbol);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(symbol);
    } else {
      addToWatchlist(stockDetail);
    }
  };

  // 플랫폼 아이콘 맵핑
  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      reddit: '🔴',
      youtube: '📺',
      twitter: '🐦',
      stocktwits: '💬',
      seeking_alpha: '📈',
    };
    return icons[platform] || '📱';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
      >
        ← 대시보드로 돌아가기
      </button>

      {/* Header */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {stockDetail.symbol}
              </h1>
              <span className="text-sm bg-gray-100 dark:bg-dark-bg px-3 py-1 rounded text-gray-700 dark:text-gray-300">
                #{stockDetail.rank}
              </span>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{stockDetail.name}</p>
            <p className="text-gray-700 dark:text-gray-300 max-w-3xl">{stockDetail.description}</p>
          </div>

          <button
            onClick={handleWatchlistToggle}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              inWatchlist
                ? 'bg-gray-200 dark:bg-dark-bg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                : 'bg-stock-up text-white hover:bg-stock-up/80'
            }`}
          >
            {inWatchlist ? '관심종목 제거' : '관심종목 추가'}
          </button>
        </div>

        {/* Price Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">현재가</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${stockDetail.price.toFixed(2)}
            </p>
            <p className={`text-lg font-semibold ${changeColor}`}>
              {isPositive ? '+' : ''}
              {stockDetail.change_percent.toFixed(2)}% (${Math.abs(stockDetail.change_amount).toFixed(2)})
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">거래량</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {(stockDetail.volume / 1000000).toFixed(1)}M
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">시가총액</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${(stockDetail.market_cap / 1000000000).toFixed(1)}B
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">섹터</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stockDetail.sector}
            </p>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🏢 기업 정보
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">CEO</p>
            <p className="text-gray-900 dark:text-white font-semibold">{stockDetail.ceo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">직원 수</p>
            <p className="text-gray-900 dark:text-white font-semibold">
              {stockDetail.employees.toLocaleString()}명
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">본사</p>
            <p className="text-gray-900 dark:text-white font-semibold">{stockDetail.headquarters}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">설립</p>
            <p className="text-gray-900 dark:text-white font-semibold">{stockDetail.founded}년</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Chart */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            📈 주가 추이 (최근 5일)
          </h3>
          <StockChart data={stockDetail.chart_data} symbol={stockDetail.symbol} />
        </div>

        {/* Volume Chart */}
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            📊 거래량 (최근 5일)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stockDetail.chart_data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="volume" fill="#6b7280" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent News */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📰 최근 뉴스
        </h2>
        <div className="space-y-4">
          {stockDetail.recent_news.map((news) => (
            <a
              key={news.id}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-50 dark:bg-dark-bg rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-stock-up dark:hover:text-stock-up transition-colors">
                  {news.title}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    news.sentiment === 'positive'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : news.sentiment === 'negative'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {news.sentiment}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{news.summary}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                <span>{news.source}</span>
                <span>•</span>
                <span>{new Date(news.published_at).toLocaleDateString('ko-KR')}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Top SNS Links */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🔥 SNS 인기 게시물 TOP 5
        </h2>
        <div className="space-y-3">
          {stockDetail.sns_links.map((link, index) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-dark-card rounded-full flex items-center justify-center font-bold text-gray-900 dark:text-white">
                {index + 1}
              </div>
              <div className="flex-shrink-0 text-2xl">{getPlatformIcon(link.platform)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 dark:text-white font-semibold group-hover:text-stock-up dark:group-hover:text-stock-up transition-colors truncate">
                  {link.title}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500 mt-1">
                  <span>{link.author}</span>
                  <span>•</span>
                  <span>👁 {link.view_count.toLocaleString()} views</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
