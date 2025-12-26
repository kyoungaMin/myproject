from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class StockInfo(BaseModel):
    """주식 기본 정보 응답 모델"""
    symbol: str = Field(..., description="주식 심볼 (예: AAPL, TSLA)")
    name: Optional[str] = Field(None, description="회사명")
    currency: Optional[str] = Field(None, description="통화")
    exchange: Optional[str] = Field(None, description="거래소")
    market_cap: Optional[float] = Field(None, description="시가총액")
    sector: Optional[str] = Field(None, description="섹터")
    industry: Optional[str] = Field(None, description="산업")


class StockPrice(BaseModel):
    """주식 가격 정보 응답 모델"""
    symbol: str = Field(..., description="주식 심볼")
    current_price: Optional[float] = Field(None, description="현재가")
    previous_close: Optional[float] = Field(None, description="전일 종가")
    open_price: Optional[float] = Field(None, description="시가")
    day_high: Optional[float] = Field(None, description="당일 최고가")
    day_low: Optional[float] = Field(None, description="당일 최저가")
    volume: Optional[int] = Field(None, description="거래량")
    change: Optional[float] = Field(None, description="가격 변동")
    change_percent: Optional[float] = Field(None, description="변동률 (%)")


class StockQuote(BaseModel):
    """주식 종합 정보 응답 모델"""
    info: StockInfo
    price: StockPrice


class HistoricalDataPoint(BaseModel):
    """과거 데이터 포인트"""
    date: str = Field(..., description="날짜")
    open: Optional[float] = Field(None, description="시가")
    high: Optional[float] = Field(None, description="고가")
    low: Optional[float] = Field(None, description="저가")
    close: Optional[float] = Field(None, description="종가")
    volume: Optional[int] = Field(None, description="거래량")


class HistoricalData(BaseModel):
    """과거 데이터 응답 모델"""
    symbol: str = Field(..., description="주식 심볼")
    period: str = Field(..., description="조회 기간")
    data: list[HistoricalDataPoint] = Field(..., description="과거 데이터 목록")


class RankedStockQuote(BaseModel):
    """순위가 포함된 주식 종합 정보"""
    rank: int = Field(..., description="순위")
    quote: StockQuote = Field(..., description="주식 종합 정보")


class BriefingRequest(BaseModel):
    """브리핑 생성 요청 모델"""
    ticker: str = Field(..., description="주식 티커 심볼 (예: TSLA, AAPL)")
    type: str = Field(default="most_actives", description="브리핑 타입")


class BriefingResponse(BaseModel):
    """브리핑 생성 응답 모델"""
    ticker: str = Field(..., description="주식 티커 심볼")
    type: str = Field(..., description="브리핑 타입")
    generated_at: str = Field(..., description="생성 시각")
    content: str = Field(..., description="브리핑 마크다운 콘텐츠")


class ErrorResponse(BaseModel):
    """에러 응답 모델"""
    error: str = Field(..., description="에러 메시지")
    detail: Optional[str] = Field(None, description="상세 내용")
