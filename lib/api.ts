const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// 백엔드 API 응답 타입
export interface StockInfoResponse {
  symbol: string;
  name: string | null;
  currency: string | null;
  exchange: string | null;
  market_cap: number | null;
  sector: string | null;
  industry: string | null;
}

export interface StockPriceResponse {
  symbol: string;
  current_price: number | null;
  previous_close: number | null;
  open_price: number | null;
  day_high: number | null;
  day_low: number | null;
  volume: number | null;
  change: number | null;
  change_percent: number | null;
}

export interface StockQuoteResponse {
  info: StockInfoResponse;
  price: StockPriceResponse;
}

export interface HistoricalDataPoint {
  date: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

export interface HistoricalDataResponse {
  symbol: string;
  period: string;
  data: HistoricalDataPoint[];
}

/**
 * 주식 기본 정보 조회
 */
export async function getStockInfo(symbol: string): Promise<StockInfoResponse> {
  const response = await fetch(`${API_BASE_URL}/stocks/info/${symbol}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock info for ${symbol}`);
  }
  return response.json();
}

/**
 * 주식 가격 정보 조회
 */
export async function getStockPrice(symbol: string): Promise<StockPriceResponse> {
  const response = await fetch(`${API_BASE_URL}/stocks/price/${symbol}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock price for ${symbol}`);
  }
  return response.json();
}

/**
 * 주식 종합 정보 조회 (기본 정보 + 가격 정보)
 */
export async function getStockQuote(symbol: string): Promise<StockQuoteResponse> {
  const response = await fetch(`${API_BASE_URL}/stocks/quote/${symbol}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock quote for ${symbol}`);
  }
  return response.json();
}

/**
 * 주식 과거 데이터 조회
 * @param symbol 주식 심볼
 * @param period 조회 기간 (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
 */
export async function getHistoricalData(
  symbol: string,
  period: string = '1mo'
): Promise<HistoricalDataResponse> {
  const response = await fetch(
    `${API_BASE_URL}/stocks/history/${symbol}?period=${period}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch historical data for ${symbol}`);
  }
  return response.json();
}

/**
 * 여러 주식의 종합 정보 조회 (병렬 처리)
 */
export async function getMultipleStockQuotes(
  symbols: string[]
): Promise<StockQuoteResponse[]> {
  const promises = symbols.map((symbol) => getStockQuote(symbol));
  const results = await Promise.allSettled(promises);

  return results
    .filter((result): result is PromiseFulfilledResult<StockQuoteResponse> =>
      result.status === 'fulfilled'
    )
    .map((result) => result.value);
}

/**
 * API 응답을 프론트엔드 Stock 타입으로 변환
 */
export function convertQuoteToStock(
  quote: StockQuoteResponse,
  rank: number = 0
): any {
  const { info, price } = quote;

  return {
    rank,
    symbol: info.symbol,
    name: info.name || info.symbol,
    price: price.current_price || 0,
    change_percent: price.change_percent || 0,
    change_amount: price.change || 0,
    volume: price.volume || 0,
    market_cap: info.market_cap || 0,
    composite_score: 0, // 백엔드에서 계산되지 않음
    score_breakdown: {
      volume_score: 0,
      change_score: 0,
      appearance_bonus: 0,
    },
    sources: [],
    sector: info.sector || 'Unknown',
  };
}

/**
 * 과거 데이터를 차트 데이터 형식으로 변환
 */
export function convertHistoricalToChartData(
  historical: HistoricalDataResponse
): any[] {
  return historical.data.map((point) => ({
    date: point.date,
    price: point.close || 0,
    volume: point.volume || 0,
    change_percent: 0, // 계산 필요 시 추가
  }));
}

/**
 * 화제 종목 목록 조회
 */
export async function getTrendingStocks(): Promise<StockQuoteResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/stocks/trending`);
  if (!response.ok) {
    throw new Error('Failed to fetch trending stocks');
  }
  return response.json();
}

/**
 * 티커로 종목 상세 정보 조회
 */
export async function getStockByTicker(ticker: string): Promise<StockQuoteResponse> {
  const response = await fetch(`${API_BASE_URL}/api/stocks/${ticker}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock ${ticker}`);
  }
  return response.json();
}

/**
 * 순위가 포함된 주식 정보
 */
export interface RankedStockQuoteResponse {
  rank: number;
  quote: StockQuoteResponse;
}

/**
 * TOP N 종목 조회
 * @param type 스크리너 타입 (most_actives, day_gainers, day_losers)
 * @param count 조회할 종목 개수 (1-10)
 */
export async function getTopStocks(
  type: string = 'most_actives',
  count: number = 5
): Promise<RankedStockQuoteResponse[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/stocks/trending/top?type=${type}&count=${count}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch top stocks (${type})`);
  }
  return response.json();
}

/**
 * 브리핑 생성 요청
 */
export interface BriefingRequest {
  ticker: string;
  type: string;
}

/**
 * 브리핑 생성 응답
 */
export interface BriefingResponse {
  ticker: string;
  type: string;
  generated_at: string;
  content: string;
}

/**
 * 브리핑 생성
 * @param ticker 주식 티커 심볼
 * @param type 브리핑 타입 (most_actives, day_gainers, day_losers)
 */
export async function generateBriefing(
  ticker: string,
  type: string = 'most_actives'
): Promise<BriefingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/briefing/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ticker, type }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate briefing for ${ticker}`);
  }

  return response.json();
}
