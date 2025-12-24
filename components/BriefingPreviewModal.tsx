'use client';

import { Briefing } from '@/lib/types';
import { useState, useEffect } from 'react';

interface BriefingPreviewModalProps {
  briefing: Briefing;
  isOpen: boolean;
  onClose: () => void;
}

export default function BriefingPreviewModal({ briefing, isOpen, onClose }: BriefingPreviewModalProps) {
  const [selectedChannels, setSelectedChannels] = useState({
    email: false,
    slack: false,
  });
  const [isSending, setIsSending] = useState(false);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChannelToggle = (channel: 'email' | 'slack') => {
    setSelectedChannels(prev => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  const handleSend = async () => {
    if (!selectedChannels.email && !selectedChannels.slack) {
      alert('발송할 채널을 선택해주세요.');
      return;
    }

    setIsSending(true);

    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000));

    const channels = [];
    if (selectedChannels.email) channels.push('이메일');
    if (selectedChannels.slack) channels.push('슬랙');

    alert(`${channels.join(', ')}로 브리핑이 발송되었습니다!`);
    setIsSending(false);
    onClose();
  };

  const topStock = briefing.featured_stocks[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-dark-card border border-dark-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="sticky top-0 bg-dark-card border-b border-dark-border p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              브리핑 미리보기
            </h2>
            <p className="text-sm text-gray-400">
              발송 전 내용을 확인하세요
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-dark-bg rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="p-6 space-y-6">
          {/* 브리핑 정보 */}
          <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">{briefing.title}</h3>
              <span className="text-xs bg-stock-up/20 text-stock-up px-3 py-1 rounded-full font-semibold">
                {briefing.status}
              </span>
            </div>
            <p className="text-sm text-gray-400">{briefing.subtitle}</p>
          </div>

          {/* 이미지 프리뷰 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-3">📸 브리핑 이미지</h4>
            <div className="bg-gradient-to-br from-dark-border to-dark-bg rounded-lg p-8 text-center border border-dark-border">
              <div className="text-6xl mb-4">🌙</div>
              <p className="text-white text-2xl font-bold mb-2">{briefing.title}</p>
              {topStock && (
                <div className="mt-4">
                  <p className="text-gray-400 mb-2">화제 종목</p>
                  <p className="text-white text-3xl font-bold">{topStock.symbol}</p>
                  <p className={`text-2xl font-bold ${topStock.change_percent >= 0 ? 'text-stock-up' : 'text-stock-down'}`}>
                    {topStock.change_percent >= 0 ? '+' : ''}{topStock.change_percent.toFixed(2)}%
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-4">{briefing.images.main.alt_text}</p>
            </div>
          </div>

          {/* 시장 개요 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-3">📊 시장 개요</h4>
            <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
              <p className="text-gray-300 mb-4">{briefing.market_overview.summary}</p>
              <div className="grid grid-cols-3 gap-4">
                {briefing.market_overview.indices.map((index, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-xs text-gray-500 mb-1">{index.name}</p>
                    <p className="text-lg font-bold text-white">{index.value.toLocaleString()}</p>
                    <p className={`text-sm font-semibold ${index.change_percent >= 0 ? 'text-stock-up' : 'text-stock-down'}`}>
                      {index.change_percent >= 0 ? '+' : ''}{index.change_percent.toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 브리핑 리포트 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-3">📝 브리핑 리포트</h4>
            <div className="bg-dark-bg rounded-lg p-4 border border-dark-border space-y-4">
              <p className="text-gray-300 leading-relaxed">{briefing.content.text_summary}</p>

              <div>
                <p className="text-white font-semibold mb-2">주요 포인트</p>
                <ul className="space-y-2">
                  {briefing.content.key_points.map((point, idx) => (
                    <li key={idx} className="text-gray-300 flex items-start gap-2">
                      <span className="text-stock-up">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 발송 채널 선택 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-3">📤 발송 채널 선택</h4>
            <div className="bg-dark-bg rounded-lg p-4 border border-dark-border space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedChannels.email}
                  onChange={() => handleChannelToggle('email')}
                  className="w-5 h-5 rounded border-gray-600 text-stock-up focus:ring-stock-up focus:ring-offset-0"
                />
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-white font-semibold group-hover:text-stock-up transition-colors">이메일</p>
                    <p className="text-xs text-gray-500">
                      {briefing.delivery_stats?.email_sent.toLocaleString() || '0'}명의 구독자에게 발송
                    </p>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedChannels.slack}
                  onChange={() => handleChannelToggle('slack')}
                  className="w-5 h-5 rounded border-gray-600 text-stock-up focus:ring-stock-up focus:ring-offset-0"
                />
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="text-white font-semibold group-hover:text-stock-up transition-colors">슬랙</p>
                    <p className="text-xs text-gray-500">
                      {briefing.delivery_stats?.slack_sent.toLocaleString() || '0'}개 채널에 발송
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="sticky bottom-0 bg-dark-card border-t border-dark-border p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg font-semibold text-gray-400 hover:text-white hover:bg-dark-bg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSend}
            disabled={isSending || (!selectedChannels.email && !selectedChannels.slack)}
            className="px-6 py-3 rounded-lg font-semibold bg-stock-up hover:bg-stock-up/80 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSending ? (
              <>
                <span className="animate-spin">⏳</span>
                발송 중...
              </>
            ) : (
              <>
                <span>🚀</span>
                발송하기
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
