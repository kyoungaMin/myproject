import Link from 'next/link';
import { Briefing } from '@/lib/types';

interface BriefingCardProps {
  briefing: Briefing;
}

export default function BriefingCard({ briefing }: BriefingCardProps) {
  const topStock = briefing.featured_stocks[0];
  const isPositive = topStock?.change_percent >= 0;
  const changeColor = isPositive ? 'text-stock-up' : 'text-stock-down';

  return (
    <Link href={`/briefing/${briefing.id}`}>
      <div className="bg-dark-card border border-dark-border rounded-lg p-5 hover:border-stock-up/50 transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">
              {briefing.title}
            </h3>
            <p className="text-sm text-gray-400">
              {new Date(briefing.target_date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <span className={`
            px-3 py-1 rounded-full text-xs font-semibold
            ${briefing.status === 'completed' ? 'bg-stock-up/20 text-stock-up' : 'bg-gray-700 text-gray-300'}
          `}>
            {briefing.status}
          </span>
        </div>

        {topStock && (
          <div className="mb-3 p-3 bg-dark-bg rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">화제 종목</p>
                <p className="text-white font-bold">{topStock.symbol}</p>
                <p className="text-xs text-gray-400">{topStock.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">
                  ${topStock.price.toFixed(2)}
                </p>
                <p className={`text-sm font-semibold ${changeColor}`}>
                  {isPositive ? '+' : ''}{topStock.change_percent.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm text-gray-300 line-clamp-2">
            {briefing.market_overview.summary}
          </p>

          {briefing.delivery_stats && (
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-dark-border">
              <span>발송: {briefing.delivery_stats.total_sent.toLocaleString()}</span>
              <span>오픈율: {(briefing.delivery_stats.open_rate * 100).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
