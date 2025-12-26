from datetime import datetime
from typing import Optional
from services.stock_service import StockService


class BriefingService:
    """브리핑 생성 서비스"""

    @staticmethod
    def generate_briefing(ticker: str, briefing_type: str = "most_actives") -> Optional[str]:
        """
        브리핑 마크다운 콘텐츠 생성

        Args:
            ticker: 주식 티커 심볼
            briefing_type: 브리핑 타입 (most_actives, day_gainers, day_losers 등)

        Returns:
            str: 마크다운 형식의 브리핑 콘텐츠 또는 None
        """
        try:
            # 종목 정보 조회
            quote = StockService.get_stock_quote(ticker)
            if not quote:
                return None

            # 과거 데이터 조회 (5일)
            historical = StockService.get_historical_data(ticker, "5d")

            # 현재 시각
            now = datetime.now()
            date_str = now.strftime("%Y년 %m월 %d일")
            time_str = now.strftime("%H:%M")

            # 종목 정보 추출
            info = quote.info
            price = quote.price

            # 변동률 계산
            change_percent = price.change_percent or 0
            change_direction = "상승" if change_percent > 0 else "하락" if change_percent < 0 else "보합"
            change_emoji = "📈" if change_percent > 0 else "📉" if change_percent < 0 else "➡️"

            # 거래량 분석
            volume = price.volume or 0
            volume_str = f"{volume:,}" if volume > 0 else "N/A"

            # 시가총액
            market_cap = info.market_cap or 0
            market_cap_b = market_cap / 1_000_000_000 if market_cap > 0 else 0

            # 브리핑 타입별 제목
            type_titles = {
                "most_actives": "거래량 급증",
                "day_gainers": "급등 종목",
                "day_losers": "급락 종목",
            }
            type_title = type_titles.get(briefing_type, "화제의 종목")

            # 조건부 값 미리 계산
            prev_close_str = f"${price.previous_close:.2f}" if price.previous_close else "N/A"
            open_str = f"${price.open_price:.2f}" if price.open_price else "N/A"
            high_str = f"${price.day_high:.2f}" if price.day_high else "N/A"
            low_str = f"${price.day_low:.2f}" if price.day_low else "N/A"
            day_low_val = price.day_low if price.day_low else 0
            day_high_val = price.day_high if price.day_high else 0
            timestamp_str = now.strftime("%Y-%m-%d %H:%M:%S")

            # 마크다운 템플릿
            briefing_content = f"""# 📊 {info.name} ({ticker}) - {type_title} 브리핑

**생성 일시**: {date_str} {time_str}
**브리핑 타입**: {type_title}

---

## 💼 기업 개요

- **회사명**: {info.name or ticker}
- **티커**: {ticker}
- **섹터**: {info.sector or 'N/A'}
- **산업**: {info.industry or 'N/A'}
- **거래소**: {info.exchange or 'N/A'}

---

## 💰 현재 주가 정보

| 항목 | 값 |
|------|-----|
| **현재가** | ${price.current_price:.2f} |
| **전일 종가** | {prev_close_str} |
| **변동** | {change_emoji} ${abs(price.change or 0):.2f} ({change_percent:+.2f}%) |
| **상태** | {change_direction} |
| **시가** | {open_str} |
| **당일 최고가** | {high_str} |
| **당일 최저가** | {low_str} |
| **거래량** | {volume_str} |
| **시가총액** | ${market_cap_b:.2f}B |

---

## 📈 주요 포인트

### {change_emoji} 가격 동향
- 현재 주가는 **${price.current_price:.2f}**로, 전일 대비 **{change_percent:+.2f}%** {change_direction}했습니다.
- 당일 가격 범위: ${day_low_val:.2f} ~ ${day_high_val:.2f}

### 📊 거래량 분석
- 오늘의 거래량은 **{volume_str}**를 기록했습니다.
"""

            # 브리핑 타입별 추가 분석
            if briefing_type == "most_actives":
                briefing_content += f"""- 이는 거래량 급증을 나타내며, 시장의 높은 관심을 받고 있습니다.
"""
            elif briefing_type == "day_gainers":
                briefing_content += f"""- 급등세를 보이며 투자자들의 높은 매수세를 보이고 있습니다.
"""
            elif briefing_type == "day_losers":
                briefing_content += f"""- 급락세를 보이며 매도 압력이 높은 상황입니다.
"""

            # 과거 데이터가 있으면 추가
            if historical and historical.data:
                recent_closes = [d.close for d in historical.data if d.close]
                if len(recent_closes) >= 2:
                    week_change = ((recent_closes[-1] - recent_closes[0]) / recent_closes[0]) * 100
                    briefing_content += f"""
### 📅 최근 5일 추세
- 5일 전 대비: **{week_change:+.2f}%**
- 최근 5일간 종가 추이를 통해 {"상승" if week_change > 0 else "하락"} 트렌드를 보이고 있습니다.
"""

            briefing_content += f"""
---

## ⚠️ 투자 유의사항

이 브리핑은 실시간 시장 데이터를 기반으로 자동 생성되었습니다.
투자 결정 시에는 다음 사항을 고려하시기 바랍니다:

- 📰 최신 뉴스 및 공시 확인
- 📊 기술적 지표 분석
- 💼 기업 재무제표 검토
- 🌐 산업 동향 파악
- ⚖️ 리스크 관리

> **면책조항**: 이 브리핑은 정보 제공 목적으로만 사용되며, 투자 권유나 조언으로 해석되어서는 안 됩니다.

---

*생성 시각: {timestamp_str}*
"""

            return briefing_content

        except Exception as e:
            print(f"Error generating briefing for {ticker}: {str(e)}")
            return None
