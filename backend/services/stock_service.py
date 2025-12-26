from yahooquery import Ticker, Screener
from typing import Optional, Dict, Any, List
from models.stock import (
    StockInfo,
    StockPrice,
    StockQuote,
    HistoricalData,
    HistoricalDataPoint
)


class StockService:
    """주식 데이터 조회 서비스"""

    @staticmethod
    def get_stock_info(symbol: str) -> Optional[StockInfo]:
        """
        주식 기본 정보 조회

        Args:
            symbol: 주식 심볼 (예: AAPL, TSLA)

        Returns:
            StockInfo: 주식 기본 정보 또는 None
        """
        try:
            ticker = Ticker(symbol)
            info = ticker.summary_detail.get(symbol, {})
            profile = ticker.asset_profile.get(symbol, {})
            price_info = ticker.price.get(symbol, {})

            # 에러 체크
            if isinstance(info, str) or isinstance(profile, str) or isinstance(price_info, str):
                return None

            return StockInfo(
                symbol=symbol.upper(),
                name=price_info.get('shortName'),
                currency=info.get('currency'),
                exchange=price_info.get('exchangeName'),
                market_cap=price_info.get('marketCap'),
                sector=profile.get('sector'),
                industry=profile.get('industry')
            )
        except Exception as e:
            print(f"Error fetching stock info for {symbol}: {str(e)}")
            return None

    @staticmethod
    def get_stock_price(symbol: str) -> Optional[StockPrice]:
        """
        주식 가격 정보 조회

        Args:
            symbol: 주식 심볼

        Returns:
            StockPrice: 주식 가격 정보 또는 None
        """
        try:
            ticker = Ticker(symbol)
            info = ticker.summary_detail.get(symbol, {})
            price_info = ticker.price.get(symbol, {})

            # 에러 체크
            if isinstance(info, str) or isinstance(price_info, str):
                return None

            current_price = price_info.get('regularMarketPrice')
            previous_close = price_info.get('regularMarketPreviousClose')

            # 변동 계산
            change = None
            change_percent = None
            if current_price and previous_close:
                change = current_price - previous_close
                change_percent = (change / previous_close) * 100

            return StockPrice(
                symbol=symbol.upper(),
                current_price=current_price,
                previous_close=previous_close,
                open_price=price_info.get('regularMarketOpen'),
                day_high=price_info.get('regularMarketDayHigh'),
                day_low=price_info.get('regularMarketDayLow'),
                volume=price_info.get('regularMarketVolume'),
                change=change,
                change_percent=change_percent
            )
        except Exception as e:
            print(f"Error fetching stock price for {symbol}: {str(e)}")
            return None

    @staticmethod
    def get_stock_quote(symbol: str) -> Optional[StockQuote]:
        """
        주식 종합 정보 조회 (기본 정보 + 가격 정보)

        Args:
            symbol: 주식 심볼

        Returns:
            StockQuote: 주식 종합 정보 또는 None
        """
        info = StockService.get_stock_info(symbol)
        price = StockService.get_stock_price(symbol)

        if not info or not price:
            return None

        return StockQuote(info=info, price=price)

    @staticmethod
    def get_historical_data(
        symbol: str,
        period: str = "1mo"
    ) -> Optional[HistoricalData]:
        """
        주식 과거 데이터 조회

        Args:
            symbol: 주식 심볼
            period: 조회 기간 (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)

        Returns:
            HistoricalData: 과거 데이터 또는 None
        """
        try:
            ticker = Ticker(symbol)
            hist = ticker.history(period=period)

            # 데이터가 비어있거나 에러인 경우
            if hist.empty or isinstance(hist, str):
                return None

            # DataFrame을 리스트로 변환
            data_points = []
            for index, row in hist.iterrows():
                # index가 튜플인 경우 (symbol, date) 형태
                if isinstance(index, tuple):
                    date = index[1].strftime('%Y-%m-%d')
                else:
                    date = index.strftime('%Y-%m-%d')

                data_points.append(
                    HistoricalDataPoint(
                        date=date,
                        open=float(row.get('open', 0)) if row.get('open') else None,
                        high=float(row.get('high', 0)) if row.get('high') else None,
                        low=float(row.get('low', 0)) if row.get('low') else None,
                        close=float(row.get('close', 0)) if row.get('close') else None,
                        volume=int(row.get('volume', 0)) if row.get('volume') else None
                    )
                )

            return HistoricalData(
                symbol=symbol.upper(),
                period=period,
                data=data_points
            )
        except Exception as e:
            print(f"Error fetching historical data for {symbol}: {str(e)}")
            return None

    @staticmethod
    def get_top_stocks(
        screener_type: str = "most_actives",
        count: int = 5
    ) -> List[Dict[str, Any]]:
        """
        TOP N 종목 조회 (Screener 사용)

        Args:
            screener_type: 스크리너 타입 (most_actives, day_gainers, day_losers 등)
            count: 조회할 종목 개수 (1-10)

        Returns:
            List[Dict]: 순위가 포함된 종목 리스트
        """
        try:
            # count 범위 검증 (1-10)
            count = max(1, min(10, count))

            # Screener로 데이터 조회
            screener = Screener()
            data = screener.get_screeners(screener_type, count=count)

            # 종목 리스트 추출
            quotes = data.get(screener_type, {}).get('quotes', [])

            # 결과 리스트 생성 (순위 포함)
            results = []
            for rank, quote in enumerate(quotes, start=1):
                symbol = quote.get('symbol')

                # 각 종목의 상세 정보 조회
                stock_quote = StockService.get_stock_quote(symbol)

                if stock_quote:
                    results.append({
                        'rank': rank,
                        'quote': stock_quote
                    })

            return results

        except Exception as e:
            print(f"Error fetching top stocks ({screener_type}): {str(e)}")
            return []
