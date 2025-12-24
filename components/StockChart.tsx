'use client';

import { StockChartData } from '@/lib/types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface StockChartProps {
  data: StockChartData[];
  symbol: string;
}

export default function StockChart({ data, symbol }: StockChartProps) {
  // 전체적인 추세 판단 (첫날과 마지막날 비교)
  const overallTrend = data[data.length - 1].price > data[0].price;
  const lineColor = overallTrend ? '#10b981' : '#ef4444';

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-dark-card border border-dark-border rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-1">{data.date}</p>
          <p className="text-white">
            가격: <span className="font-bold">${data.price.toFixed(2)}</span>
          </p>
          <p className={`text-sm ${data.change_percent >= 0 ? 'text-stock-up' : 'text-stock-down'}`}>
            변동: {data.change_percent >= 0 ? '+' : ''}{data.change_percent.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const VolumeTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-dark-card border border-dark-border rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-1">{data.date}</p>
          <p className="text-white">
            거래량: <span className="font-bold">{(data.volume / 1000000).toFixed(1)}M</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* 주가 라인 차트 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-400">최근 5일 주가 추이</h4>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${overallTrend ? 'bg-stock-up' : 'bg-stock-down'}`}></div>
            <span className={`text-sm font-semibold ${overallTrend ? 'text-stock-up' : 'text-stock-down'}`}>
              {overallTrend ? '상승 추세' : '하락 추세'}
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3561" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              dot={{ fill: lineColor, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 거래량 바 차트 */}
      <div>
        <h4 className="text-sm font-semibold text-gray-400 mb-3">거래량</h4>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3561" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip content={<VolumeTooltip />} />
            <Bar
              dataKey="volume"
              fill="#6b7280"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 차트 범례 */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-dark-border">
        <span>데이터 출처: Yahoo Finance</span>
        <span>단위: USD</span>
      </div>
    </div>
  );
}
