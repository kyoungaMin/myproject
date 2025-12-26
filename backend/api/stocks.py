from fastapi import APIRouter, HTTPException, Query
from typing import List
from models.stock import (
    StockInfo,
    StockPrice,
    StockQuote,
    HistoricalData,
    RankedStockQuote,
    ErrorResponse
)
from services.stock_service import StockService

router = APIRouter(
    prefix="/stocks",
    tags=["stocks"]
)

# 추가 라우터 (API 경로용)
api_router = APIRouter(
    prefix="/api/stocks",
    tags=["api-stocks"]
)


@router.get(
    "/info/{symbol}",
    response_model=StockInfo,
    responses={
        404: {"model": ErrorResponse, "description": "주식을 찾을 수 없음"},
        500: {"model": ErrorResponse, "description": "서버 에러"}
    },
    summary="주식 기본 정보 조회",
    description="주식 심볼을 사용하여 회사명, 섹터, 산업 등의 기본 정보를 조회합니다."
)
async def get_stock_info(symbol: str):
    """
    주식 기본 정보 조회

    - **symbol**: 주식 심볼 (예: AAPL, TSLA, MSFT)
    """
    info = StockService.get_stock_info(symbol)
    if not info:
        raise HTTPException(
            status_code=404,
            detail=f"주식 '{symbol}'을(를) 찾을 수 없습니다."
        )
    return info


@router.get(
    "/price/{symbol}",
    response_model=StockPrice,
    responses={
        404: {"model": ErrorResponse, "description": "주식을 찾을 수 없음"},
        500: {"model": ErrorResponse, "description": "서버 에러"}
    },
    summary="주식 가격 정보 조회",
    description="주식 심볼을 사용하여 현재가, 전일 종가, 변동률 등의 가격 정보를 조회합니다."
)
async def get_stock_price(symbol: str):
    """
    주식 가격 정보 조회

    - **symbol**: 주식 심볼 (예: AAPL, TSLA, MSFT)
    """
    price = StockService.get_stock_price(symbol)
    if not price:
        raise HTTPException(
            status_code=404,
            detail=f"주식 '{symbol}'의 가격 정보를 찾을 수 없습니다."
        )
    return price


@router.get(
    "/quote/{symbol}",
    response_model=StockQuote,
    responses={
        404: {"model": ErrorResponse, "description": "주식을 찾을 수 없음"},
        500: {"model": ErrorResponse, "description": "서버 에러"}
    },
    summary="주식 종합 정보 조회",
    description="주식 심볼을 사용하여 기본 정보와 가격 정보를 한 번에 조회합니다."
)
async def get_stock_quote(symbol: str):
    """
    주식 종합 정보 조회 (기본 정보 + 가격 정보)

    - **symbol**: 주식 심볼 (예: AAPL, TSLA, MSFT)
    """
    quote = StockService.get_stock_quote(symbol)
    if not quote:
        raise HTTPException(
            status_code=404,
            detail=f"주식 '{symbol}'의 정보를 찾을 수 없습니다."
        )
    return quote


@router.get(
    "/history/{symbol}",
    response_model=HistoricalData,
    responses={
        404: {"model": ErrorResponse, "description": "주식을 찾을 수 없음"},
        400: {"model": ErrorResponse, "description": "잘못된 요청"},
        500: {"model": ErrorResponse, "description": "서버 에러"}
    },
    summary="주식 과거 데이터 조회",
    description="주식 심볼과 기간을 사용하여 과거 가격 데이터를 조회합니다."
)
async def get_historical_data(
    symbol: str,
    period: str = Query(
        default="1mo",
        description="조회 기간",
        regex="^(1d|5d|1mo|3mo|6mo|1y|2y|5y|10y|ytd|max)$"
    )
):
    """
    주식 과거 데이터 조회

    - **symbol**: 주식 심볼 (예: AAPL, TSLA, MSFT)
    - **period**: 조회 기간
        - 1d: 1일
        - 5d: 5일
        - 1mo: 1개월 (기본값)
        - 3mo: 3개월
        - 6mo: 6개월
        - 1y: 1년
        - 2y: 2년
        - 5y: 5년
        - 10y: 10년
        - ytd: 올해 초부터
        - max: 전체 기간
    """
    data = StockService.get_historical_data(symbol, period)
    if not data:
        raise HTTPException(
            status_code=404,
            detail=f"주식 '{symbol}'의 과거 데이터를 찾을 수 없습니다."
        )
    return data


# ============================================
# API 엔드포인트 (프론트엔드 연동용)
# ============================================

@api_router.get(
    "/trending/top",
    response_model=List[RankedStockQuote],
    responses={
        400: {"model": ErrorResponse, "description": "잘못된 요청"},
        500: {"model": ErrorResponse, "description": "서버 에러"}
    },
    summary="TOP N 종목 조회",
    description="스크리너를 사용하여 상위 N개 종목을 순위와 함께 조회합니다."
)
async def get_top_stocks(
    type: str = Query(
        default="most_actives",
        description="스크리너 타입 (most_actives, day_gainers, day_losers 등)"
    ),
    count: int = Query(
        default=5,
        ge=1,
        le=10,
        description="조회할 종목 개수 (1-10)"
    )
):
    """
    TOP N 종목 조회

    - **type**: 스크리너 타입
        - most_actives: 거래량 상위 (기본값)
        - day_gainers: 상승률 상위
        - day_losers: 하락률 상위
    - **count**: 조회할 종목 개수 (1-10, 기본값: 5)

    각 종목에는 순위(rank)와 종합 정보(quote)가 포함됩니다.
    """
    try:
        results = StockService.get_top_stocks(type, count)

        if not results:
            raise HTTPException(
                status_code=500,
                detail=f"TOP {count} 종목 데이터를 불러올 수 없습니다."
            )

        # Dict를 RankedStockQuote 모델로 변환
        ranked_quotes = [
            RankedStockQuote(rank=item['rank'], quote=item['quote'])
            for item in results
        ]

        return ranked_quotes

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"서버 에러가 발생했습니다: {str(e)}"
        )


@api_router.get(
    "/trending",
    response_model=List[StockQuote],
    summary="화제 종목 목록 조회",
    description="인기 있는 주식 종목들의 실시간 정보를 조회합니다."
)
async def get_trending_stocks():
    """
    화제 종목 목록 조회

    기본적으로 주요 미국 기술주 6개를 반환합니다.
    실제 서비스에서는 거래량, 변동률 등을 기준으로 동적으로 선정할 수 있습니다.
    """
    # 주요 종목 심볼 (실제로는 알고리즘으로 선정)
    trending_symbols = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN']

    results = []
    for symbol in trending_symbols:
        quote = StockService.get_stock_quote(symbol)
        if quote:
            results.append(quote)

    if not results:
        raise HTTPException(
            status_code=500,
            detail="화제 종목 데이터를 불러올 수 없습니다."
        )

    return results


@api_router.get(
    "/{ticker}",
    response_model=StockQuote,
    responses={
        404: {"model": ErrorResponse, "description": "종목을 찾을 수 없음"},
        500: {"model": ErrorResponse, "description": "서버 에러"}
    },
    summary="종목 상세 정보 조회",
    description="티커 심볼로 주식의 상세 정보를 조회합니다."
)
async def get_stock_by_ticker(ticker: str):
    """
    종목 상세 정보 조회

    - **ticker**: 주식 티커 심볼 (예: AAPL, TSLA, MSFT)
    """
    quote = StockService.get_stock_quote(ticker.upper())
    if not quote:
        raise HTTPException(
            status_code=404,
            detail=f"종목 '{ticker}'를 찾을 수 없습니다."
        )
    return quote
