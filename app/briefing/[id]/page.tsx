'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockBriefings } from '@/data/mockData';
import { useState } from 'react';
import BriefingPreviewModal from '@/components/BriefingPreviewModal';

export default function BriefingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const briefing = mockBriefings.find(b => b.id === params.id);

  if (!briefing) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-white mb-4">
          브리핑을 찾을 수 없습니다
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

  const topStock = briefing.featured_stocks[0];
  const isPositive = topStock?.change_percent >= 0;
  const changeColor = isPositive ? 'text-stock-up' : 'text-stock-down';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
      >
        ← 대시보드로 돌아가기
      </button>

      {/* Header */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {briefing.title}
            </h1>
            <p className="text-gray-400">{briefing.subtitle}</p>
          </div>
          <span className={`
            px-4 py-2 rounded-full text-sm font-semibold
            ${briefing.status === 'completed' ? 'bg-stock-up/20 text-stock-up' : 'bg-gray-700 text-gray-300'}
          `}>
            {briefing.status}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>
            📅 {new Date(briefing.target_date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          {briefing.published_at && (
            <span>
              🕐 발송: {new Date(briefing.published_at).toLocaleString('ko-KR')}
            </span>
          )}
        </div>
      </div>

      {/* Image Preview */}
      <section className="bg-dark-card border border-dark-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          📸 브리핑 이미지 미리보기
        </h2>
        <div className="bg-dark-bg rounded-lg p-8 text-center">
          <div className="aspect-video bg-gradient-to-br from-dark-border to-dark-bg rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🌙</div>
              <p className="text-white text-2xl font-bold mb-2">
                {briefing.title}
              </p>
              {topStock && (
                <div className="mt-4">
                  <p className="text-gray-400 mb-2">화제 종목</p>
                  <p className="text-white text-3xl font-bold">
                    {topStock.symbol}
                  </p>
                  <p className={`text-2xl font-bold ${changeColor}`}>
                    {isPositive ? '+' : ''}{topStock.change_percent.toFixed(2)}%
                  </p>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {briefing.images.main.alt_text}
          </p>
        </div>
      </section>

      {/* Market Overview */}
      <section className="bg-dark-card border border-dark-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          📊 시장 개요
        </h2>
        <p className="text-gray-300 mb-6">
          {briefing.market_overview.summary}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {briefing.market_overview.indices.map((index, idx) => {
            const isIndexPositive = index.change_percent >= 0;
            return (
              <div key={idx} className="bg-dark-bg p-4 rounded">
                <p className="text-sm text-gray-400 mb-1">{index.name}</p>
                <p className="text-2xl font-bold text-white mb-1">
                  {index.value.toLocaleString()}
                </p>
                <p className={`text-sm font-semibold ${isIndexPositive ? 'text-stock-up' : 'text-stock-down'}`}>
                  {isIndexPositive ? '+' : ''}{index.change_percent.toFixed(2)}%
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Content */}
      <section className="bg-dark-card border border-dark-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          📝 브리핑 리포트
        </h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 leading-relaxed mb-6">
            {briefing.content.text_summary}
          </p>

          <h3 className="text-lg font-bold text-white mb-3">주요 포인트</h3>
          <ul className="space-y-2">
            {briefing.content.key_points.map((point, idx) => (
              <li key={idx} className="text-gray-300 flex items-start gap-2">
                <span className="text-stock-up">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured Stock */}
      {topStock && (
        <section className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            ⭐ 화제 종목 상세
          </h2>
          <div className="bg-dark-bg p-6 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {topStock.symbol}
                </h3>
                <p className="text-gray-400">{topStock.name}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">
                  ${topStock.price.toFixed(2)}
                </p>
                <p className={`text-xl font-semibold ${changeColor}`}>
                  {isPositive ? '+' : ''}{topStock.change_percent.toFixed(2)}%
                </p>
              </div>
            </div>

            {topStock.selection_reason && (
              <div className="p-4 bg-dark-card rounded border-l-4 border-stock-up mb-4">
                <p className="text-gray-300">{topStock.selection_reason}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">거래량</p>
                <p className="text-white font-bold">
                  {(topStock.volume / 1000000).toFixed(1)}M
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">시가총액</p>
                <p className="text-white font-bold">
                  ${(topStock.market_cap / 1000000000).toFixed(1)}B
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">섹터</p>
                <p className="text-white font-bold">{topStock.sector}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">복합 점수</p>
                <p className="text-stock-up font-bold">
                  {topStock.composite_score.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Delivery Actions */}
      <section className="bg-dark-card border border-dark-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          📤 브리핑 발송
        </h2>
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="w-full bg-stock-up hover:bg-stock-up/80 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          🔍 미리보기 및 발송
        </button>

        {briefing.delivery_stats && (
          <div className="mt-6 pt-6 border-t border-dark-border">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">
              발송 통계
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">총 발송</p>
                <p className="text-xl font-bold text-white">
                  {briefing.delivery_stats.total_sent.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">이메일</p>
                <p className="text-xl font-bold text-white">
                  {briefing.delivery_stats.email_sent.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">오픈율</p>
                <p className="text-xl font-bold text-stock-up">
                  {(briefing.delivery_stats.open_rate * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">클릭율</p>
                <p className="text-xl font-bold text-stock-up">
                  {(briefing.delivery_stats.click_rate * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Preview Modal */}
      <BriefingPreviewModal
        briefing={briefing}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
