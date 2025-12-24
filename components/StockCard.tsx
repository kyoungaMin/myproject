import { Stock } from '@/lib/types';

interface StockCardProps {
  stock: Stock;
  featured?: boolean;
}

export default function StockCard({ stock, featured = false }: StockCardProps) {
  const isPositive = stock.change_percent >= 0;
  const changeColor = isPositive ? 'text-stock-up' : 'text-stock-down';

  return (
    <div className={`
      bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-6
      hover:border-stock-up/50 transition-all duration-200
      ${featured ? 'md:col-span-2 lg:col-span-3' : ''}
    `}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stock.symbol}</span>
            <span className="text-xs bg-gray-100 dark:bg-dark-bg px-2 py-1 rounded text-gray-700 dark:text-gray-300">
              #{stock.rank}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${stock.price.toFixed(2)}
          </p>
          <p className={`text-sm font-semibold ${changeColor}`}>
            {isPositive ? '+' : ''}{stock.change_percent.toFixed(2)}%
          </p>
        </div>
      </div>

      {featured && stock.selection_reason && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-dark-bg rounded border-l-4 border-stock-up">
          <p className="text-sm text-gray-700 dark:text-gray-300">{stock.selection_reason}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-500 mb-1">거래량</p>
          <p className="text-gray-900 dark:text-white font-semibold">
            {(stock.volume / 1000000).toFixed(1)}M
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-500 mb-1">시가총액</p>
          <p className="text-gray-900 dark:text-white font-semibold">
            ${(stock.market_cap / 1000000000).toFixed(1)}B
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-500 mb-1">섹터</p>
          <p className="text-gray-900 dark:text-white font-semibold">{stock.sector}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-500 mb-1">복합 점수</p>
          <p className="text-stock-up font-semibold">
            {stock.composite_score.toFixed(1)}
          </p>
        </div>
      </div>

      {featured && (
        <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border">
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">출처</p>
          <div className="flex flex-wrap gap-2">
            {stock.sources.map((source, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-100 dark:bg-dark-bg px-2 py-1 rounded text-gray-600 dark:text-gray-400"
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
