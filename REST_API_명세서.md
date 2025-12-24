# 🌙 당신이 잠든 사이 - REST API 명세서

## 목차
1. [API 개요](#1-api-개요)
2. [공통 사항](#2-공통-사항)
3. [화제 종목 조회 API](#3-화제-종목-조회-api)
4. [종목 상세 정보 API](#4-종목-상세-정보-api)
5. [브리핑 생성 API](#5-브리핑-생성-api)
6. [발송 API](#6-발송-api)
7. [브리핑 히스토리 조회 API](#7-브리핑-히스토리-조회-api)
8. [에러 코드 정의](#8-에러-코드-정의)

---

## 1. API 개요

### Base URL
```
Production:  https://api.whileyouslept.kr/v1
Staging:     https://staging-api.whileyouslept.kr/v1
Development: http://localhost:8000/v1
```

### API 버전
| 버전 | 상태 | 출시일 |
|------|------|--------|
| v1 | Active | 2025-12-10 |

---

## 2. 공통 사항

### 2.1 인증 (Authentication)

| 항목 | 설명 |
|------|------|
| 방식 | Bearer Token (JWT) |
| 헤더 | `Authorization: Bearer {access_token}` |
| 만료 | Access Token: 1시간 / Refresh Token: 7일 |

### 2.2 공통 Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | ✅ | JWT 액세스 토큰 |
| `Content-Type` | ✅ | `application/json` |
| `Accept-Language` | ❌ | 응답 언어 (기본: `ko`) |
| `X-Request-ID` | ❌ | 요청 추적용 UUID |

### 2.3 공통 Response 형식

**성공 응답 (2xx)**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T07:00:00Z"
  }
}
```

**실패 응답 (4xx, 5xx)**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": { ... }
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T07:00:00Z"
  }
}
```

### 2.4 페이지네이션

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | 페이지 번호 |
| `limit` | integer | 20 | 페이지당 항목 수 (최대 100) |

**페이지네이션 응답 메타**
```json
{
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_pages": 5,
    "total_items": 98
  }
}
```

---

## 3. 화제 종목 조회 API

> Yahoo Finance Screener를 활용한 화제 종목 수집

### 3.1 화제 종목 목록 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **Endpoint** | `/stocks/trending` |
| **Description** | 당일 화제 종목 목록을 복합 점수 기준으로 조회 |
| **Auth Required** | ✅ |

#### Request Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `screener_type` | string | ❌ | `all` | `most_actives`, `day_gainers`, `day_losers`, `all` |
| `limit` | integer | ❌ | 10 | 반환할 종목 수 (최대 50) |
| `min_market_cap` | number | ❌ | 1000000000 | 최소 시가총액 (USD) |
| `exclude_etf` | boolean | ❌ | true | ETF/레버리지 종목 제외 |
| `sort_by` | string | ❌ | `composite_score` | 정렬 기준: `composite_score`, `volume`, `change_percent` |

#### Request Example
```http
GET /v1/stocks/trending?screener_type=all&limit=5&min_market_cap=1000000000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "trending_stocks": [
      {
        "rank": 1,
        "symbol": "NVDA",
        "name": "NVIDIA Corporation",
        "price": 142.50,
        "change_percent": 8.32,
        "change_amount": 10.95,
        "volume": 458293100,
        "market_cap": 3520000000000,
        "composite_score": 92.4,
        "score_breakdown": {
          "volume_score": 95.2,
          "change_score": 100.0,
          "appearance_bonus": 30.0
        },
        "sources": ["most_actives", "day_gainers"],
        "sector": "Technology"
      },
      {
        "rank": 2,
        "symbol": "TSLA",
        "name": "Tesla, Inc.",
        "price": 248.75,
        "change_percent": 5.67,
        "change_amount": 13.35,
        "volume": 312456789,
        "market_cap": 792000000000,
        "composite_score": 85.7,
        "score_breakdown": {
          "volume_score": 88.5,
          "change_score": 75.0,
          "appearance_bonus": 15.0
        },
        "sources": ["most_actives"],
        "sector": "Consumer Cyclical"
      }
    ],
    "market_summary": {
      "total_collected": 75,
      "filtered_count": 42,
      "collection_time": "2025-12-10T05:30:00Z",
      "market_status": "closed",
      "last_trading_date": "2025-12-09"
    }
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T07:00:00Z"
  }
}
```

#### Error Cases

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `INVALID_SCREENER_TYPE` | 유효하지 않은 screener_type |
| 401 | `UNAUTHORIZED` | 인증 토큰 없음 또는 만료 |
| 429 | `RATE_LIMIT_EXCEEDED` | API 호출 한도 초과 |
| 500 | `YAHOO_API_ERROR` | Yahoo Finance API 오류 |
| 503 | `DATA_UNAVAILABLE` | 데이터 수집 실패 (폴백 적용) |

**에러 응답 예시 (503)**
```json
{
  "success": false,
  "error": {
    "code": "DATA_UNAVAILABLE",
    "message": "화제 종목 데이터를 가져올 수 없습니다. 폴백 데이터를 반환합니다.",
    "details": {
      "fallback_applied": true,
      "original_error": "Yahoo API timeout after 3 retries"
    }
  },
  "data": {
    "trending_stocks": [
      {
        "symbol": "SPY",
        "name": "SPDR S&P 500 ETF Trust",
        "is_fallback": true
      }
    ]
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T07:00:00Z"
  }
}
```

---

### 3.2 TOP 1 화제 종목 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **Endpoint** | `/stocks/trending/top` |
| **Description** | 복합 점수 기준 최상위 1개 종목 조회 (브리핑 메인 종목용) |
| **Auth Required** | ✅ |

#### Request Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `min_market_cap` | number | ❌ | 1000000000 | 최소 시가총액 (USD) |
| `exclude_symbols` | string | ❌ | - | 제외할 종목 (콤마 구분) |

#### Request Example
```http
GET /v1/stocks/trending/top?exclude_symbols=SPY,QQQ,TQQQ
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "top_stock": {
      "symbol": "NVDA",
      "name": "NVIDIA Corporation",
      "price": 142.50,
      "change_percent": 8.32,
      "change_amount": 10.95,
      "volume": 458293100,
      "avg_volume": 320000000,
      "volume_ratio": 1.43,
      "market_cap": 3520000000000,
      "sector": "Technology",
      "industry": "Semiconductors",
      "composite_score": 92.4,
      "score_breakdown": {
        "volume_score": 95.2,
        "change_score": 100.0,
        "appearance_bonus": 30.0
      },
      "sources": ["most_actives", "day_gainers"],
      "selection_reason": "거래량 상위 + 당일 상승률 8.32%로 복합 점수 최고"
    },
    "alternatives": [
      {
        "rank": 2,
        "symbol": "TSLA",
        "composite_score": 85.7
      },
      {
        "rank": 3,
        "symbol": "AMD",
        "composite_score": 78.3
      }
    ]
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T07:00:00Z"
  }
}
```

---

## 4. 종목 상세 정보 API

### 4.1 종목 상세 정보 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **Endpoint** | `/stocks/{symbol}` |
| **Description** | 특정 종목의 상세 정보 조회 |
| **Auth Required** | ✅ |

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `symbol` | string | ✅ | 종목 티커 (예: NVDA, AAPL) |

#### Request Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `include_news` | boolean | ❌ | true | 관련 뉴스 포함 여부 |
| `news_limit` | integer | ❌ | 5 | 뉴스 최대 개수 |
| `include_financials` | boolean | ❌ | false | 재무 정보 포함 여부 |

#### Request Example
```http
GET /v1/stocks/NVDA?include_news=true&news_limit=3
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "stock": {
      "symbol": "NVDA",
      "name": "NVIDIA Corporation",
      "description": "NVIDIA Corporation designs, develops, and sells graphics processing units and related software.",
      "sector": "Technology",
      "industry": "Semiconductors",
      "country": "United States",
      "website": "https://www.nvidia.com",
      "employees": 29600
    },
    "quote": {
      "price": 142.50,
      "open": 135.20,
      "high": 144.80,
      "low": 134.50,
      "close": 142.50,
      "previous_close": 131.55,
      "change_amount": 10.95,
      "change_percent": 8.32,
      "volume": 458293100,
      "avg_volume_10d": 320000000,
      "market_cap": 3520000000000,
      "pe_ratio": 65.2,
      "eps": 2.19,
      "52_week_high": 152.89,
      "52_week_low": 45.01,
      "last_updated": "2025-12-10T05:00:00Z"
    },
    "news": [
      {
        "id": "news_001",
        "title": "NVIDIA, AI 반도체 수요 급증으로 분기 실적 예상치 상회",
        "title_original": "NVIDIA Beats Quarterly Estimates on Surging AI Chip Demand",
        "source": "Reuters",
        "published_at": "2025-12-09T22:30:00Z",
        "url": "https://reuters.com/...",
        "sentiment": "positive",
        "sentiment_score": 0.85,
        "summary": "엔비디아가 AI 반도체 수요 증가에 힘입어 시장 예상치를 크게 상회하는 분기 실적을 발표했다."
      },
      {
        "id": "news_002",
        "title": "데이터센터 AI 투자 확대, NVIDIA 수혜 전망",
        "title_original": "Data Center AI Investment Surge Benefits NVIDIA",
        "source": "Bloomberg",
        "published_at": "2025-12-09T20:15:00Z",
        "url": "https://bloomberg.com/...",
        "sentiment": "positive",
        "sentiment_score": 0.72,
        "summary": "글로벌 데이터센터의 AI 인프라 투자 확대로 NVIDIA가 주요 수혜주로 주목받고 있다."
      }
    ],
    "technicals": {
      "rsi_14": 72.5,
      "sma_50": 128.30,
      "sma_200": 98.45,
      "macd": {
        "value": 5.23,
        "signal": 4.18,
        "histogram": 1.05
      },
      "support_level": 130.00,
      "resistance_level": 150.00
    }
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T07:00:00Z",
    "data_delayed": false
  }
}
```

#### Error Cases

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `INVALID_SYMBOL` | 유효하지 않은 종목 심볼 형식 |
| 404 | `STOCK_NOT_FOUND` | 존재하지 않는 종목 |
| 401 | `UNAUTHORIZED` | 인증 실패 |
| 429 | `RATE_LIMIT_EXCEEDED` | API 호출 한도 초과 |

**에러 응답 예시 (404)**
```json
{
  "success": false,
  "error": {
    "code": "STOCK_NOT_FOUND",
    "message": "종목을 찾을 수 없습니다: INVALID",
    "details": {
      "symbol": "INVALID",
      "suggestion": "심볼을 확인해 주세요. 예: AAPL, NVDA, TSLA"
    }
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T07:00:00Z"
  }
}
```

---

### 4.2 복수 종목 정보 일괄 조회

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **Endpoint** | `/stocks/batch` |
| **Description** | 여러 종목의 정보를 한 번에 조회 (최대 20개) |
| **Auth Required** | ✅ |

#### Request Body

```json
{
  "symbols": ["NVDA", "TSLA", "AMD", "AAPL", "MSFT"],
  "fields": ["quote", "news"],
  "news_limit": 2
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `symbols` | array[string] | ✅ | 조회할 종목 심볼 (최대 20개) |
| `fields` | array[string] | ❌ | 포함할 필드: `quote`, `news`, `technicals` |
| `news_limit` | integer | ❌ | 종목당 뉴스 개수 (기본: 2) |

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "stocks": {
      "NVDA": {
        "symbol": "NVDA",
        "name": "NVIDIA Corporation",
        "quote": {
          "price": 142.50,
          "change_percent": 8.32,
          "volume": 458293100
        },
        "news": [...]
      },
      "TSLA": {
        "symbol": "TSLA",
        "name": "Tesla, Inc.",
        "quote": {
          "price": 248.75,
          "change_percent": 5.67,
          "volume": 312456789
        },
        "news": [...]
      }
    },
    "failed_symbols": [],
    "partial_success": false
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T07:00:00Z"
  }
}
```

---

## 5. 브리핑 생성 API

### 5.1 브리핑 생성 요청

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **Endpoint** | `/briefings` |
| **Description** | 새로운 브리핑 생성 (이미지 + 텍스트) |
| **Auth Required** | ✅ (Admin) |

#### Request Body

```json
{
  "briefing_type": "daily",
  "target_date": "2025-12-10",
  "stocks": {
    "auto_select": true,
    "top_n": 5,
    "min_market_cap": 1000000000
  },
  "content": {
    "include_news_summary": true,
    "include_market_overview": true,
    "language": "ko"
  },
  "image": {
    "generate": true,
    "style": "infographic",
    "dimensions": {
      "width": 1200,
      "height": 630
    }
  },
  "schedule": {
    "send_immediately": false,
    "scheduled_time": "2025-12-10T07:00:00+09:00"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `briefing_type` | string | ✅ | `daily`, `weekly`, `special` |
| `target_date` | string | ❌ | 대상 날짜 (ISO 8601, 기본: 오늘) |
| `stocks.auto_select` | boolean | ❌ | 자동 종목 선정 여부 |
| `stocks.top_n` | integer | ❌ | 선정할 종목 수 (기본: 5) |
| `stocks.symbols` | array | ❌ | 수동 지정 시 종목 목록 |
| `content.include_news_summary` | boolean | ❌ | 뉴스 요약 포함 |
| `content.include_market_overview` | boolean | ❌ | 시장 개요 포함 |
| `content.language` | string | ❌ | 콘텐츠 언어 (ko/en) |
| `image.generate` | boolean | ❌ | AI 이미지 생성 여부 |
| `image.style` | string | ❌ | 이미지 스타일 |
| `schedule.send_immediately` | boolean | ❌ | 즉시 발송 여부 |
| `schedule.scheduled_time` | string | ❌ | 예약 발송 시간 |

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "briefing": {
      "id": "brief_20251210_001",
      "briefing_type": "daily",
      "target_date": "2025-12-10",
      "status": "generating",
      "created_at": "2025-12-10T06:30:00Z",
      "estimated_completion": "2025-12-10T06:32:00Z",
      "stocks_selected": [
        {
          "rank": 1,
          "symbol": "NVDA",
          "name": "NVIDIA Corporation",
          "composite_score": 92.4
        },
        {
          "rank": 2,
          "symbol": "TSLA",
          "name": "Tesla, Inc.",
          "composite_score": 85.7
        }
      ],
      "schedule": {
        "scheduled_time": "2025-12-10T07:00:00+09:00",
        "timezone": "Asia/Seoul"
      }
    },
    "job": {
      "job_id": "job_abc123",
      "status_url": "/v1/briefings/brief_20251210_001/status"
    }
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T06:30:00Z"
  }
}
```

#### Error Cases

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `INVALID_BRIEFING_TYPE` | 유효하지 않은 브리핑 타입 |
| 400 | `INVALID_DATE_FORMAT` | 잘못된 날짜 형식 |
| 400 | `STOCKS_NOT_SPECIFIED` | auto_select=false인데 종목 미지정 |
| 401 | `UNAUTHORIZED` | 인증 실패 |
| 403 | `ADMIN_REQUIRED` | 관리자 권한 필요 |
| 409 | `BRIEFING_ALREADY_EXISTS` | 해당 날짜 브리핑 이미 존재 |
| 500 | `IMAGE_GENERATION_FAILED` | AI 이미지 생성 실패 |
| 503 | `STOCK_DATA_UNAVAILABLE` | 종목 데이터 수집 실패 |

---

### 5.2 브리핑 생성 상태 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **Endpoint** | `/briefings/{briefing_id}/status` |
| **Description** | 브리핑 생성 진행 상태 확인 |
| **Auth Required** | ✅ |

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "briefing_id": "brief_20251210_001",
    "status": "completed",
    "progress": {
      "overall_percent": 100,
      "steps": [
        {
          "name": "stock_selection",
          "status": "completed",
          "completed_at": "2025-12-10T06:30:15Z"
        },
        {
          "name": "data_collection",
          "status": "completed",
          "completed_at": "2025-12-10T06:30:45Z"
        },
        {
          "name": "news_aggregation",
          "status": "completed",
          "completed_at": "2025-12-10T06:31:20Z"
        },
        {
          "name": "content_generation",
          "status": "completed",
          "completed_at": "2025-12-10T06:31:45Z"
        },
        {
          "name": "image_generation",
          "status": "completed",
          "completed_at": "2025-12-10T06:32:30Z"
        }
      ]
    },
    "result": {
      "briefing_url": "/v1/briefings/brief_20251210_001",
      "image_url": "https://cdn.whileyouslept.kr/briefings/2025/12/10/brief_001.png",
      "preview_url": "https://whileyouslept.kr/preview/brief_20251210_001"
    }
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T06:33:00Z"
  }
}
```

---

### 5.3 브리핑 상세 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **Endpoint** | `/briefings/{briefing_id}` |
| **Description** | 생성된 브리핑 상세 내용 조회 |
| **Auth Required** | ✅ |

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "briefing": {
      "id": "brief_20251210_001",
      "briefing_type": "daily",
      "target_date": "2025-12-10",
      "title": "🌙 12월 10일 미국 시장 브리핑",
      "subtitle": "당신이 잠든 사이, 월가에서는...",
      "status": "completed",
      "created_at": "2025-12-10T06:30:00Z",
      "published_at": "2025-12-10T07:00:00+09:00"
    },
    "market_overview": {
      "summary": "미국 증시는 AI 반도체 수요 증가 기대감에 상승 마감했습니다.",
      "indices": [
        {
          "name": "S&P 500",
          "value": 5150.25,
          "change_percent": 1.23
        },
        {
          "name": "NASDAQ",
          "value": 16420.80,
          "change_percent": 1.85
        },
        {
          "name": "DOW",
          "value": 38950.15,
          "change_percent": 0.78
        }
      ]
    },
    "featured_stocks": [
      {
        "rank": 1,
        "symbol": "NVDA",
        "name": "NVIDIA Corporation",
        "price": 142.50,
        "change_percent": 8.32,
        "volume": 458293100,
        "composite_score": 92.4,
        "highlight": "AI 반도체 수요 급증으로 분기 실적 예상치 상회",
        "news_summary": "엔비디아가 AI 칩 수요 증가에 힘입어 시장 예상을 크게 뛰어넘는 실적을 발표했습니다. 데이터센터 부문 매출이 전년 대비 200% 이상 성장했습니다.",
        "sentiment": "positive"
      }
    ],
    "content": {
      "text_summary": "오늘의 미국 시장은 기술주 중심으로 강세를 보였습니다...",
      "key_points": [
        "NVIDIA, AI 칩 수요 급증으로 8% 이상 상승",
        "테슬라, 신차 출시 기대감에 5% 상승",
        "반도체 섹터 전반 강세"
      ],
      "word_count": 350
    },
    "images": {
      "main": {
        "url": "https://cdn.whileyouslept.kr/briefings/2025/12/10/brief_001.png",
        "width": 1200,
        "height": 630,
        "alt_text": "2025년 12월 10일 미국 시장 브리핑 - NVDA 8.32% 상승"
      },
      "thumbnail": {
        "url": "https://cdn.whileyouslept.kr/briefings/2025/12/10/brief_001_thumb.png",
        "width": 400,
        "height": 210
      }
    },
    "delivery_stats": {
      "total_sent": 8542,
      "email_sent": 7230,
      "slack_sent": 1312,
      "open_rate": 0.452,
      "click_rate": 0.128
    }
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T08:00:00Z"
  }
}
```

---

## 6. 발송 API

### 6.1 이메일 발송

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **Endpoint** | `/delivery/email` |
| **Description** | 브리핑을 이메일로 발송 |
| **Auth Required** | ✅ (Admin) |

#### Request Body

```json
{
  "briefing_id": "brief_20251210_001",
  "recipients": {
    "type": "all_subscribers",
    "filter": {
      "subscription_status": "active",
      "preferred_time": "07:00"
    }
  },
  "email_config": {
    "subject": "🌙 [당신이 잠든 사이] 12월 10일 미국 시장 브리핑",
    "from_name": "당신이 잠든 사이",
    "from_email": "briefing@whileyouslept.kr",
    "reply_to": "support@whileyouslept.kr",
    "template": "daily_briefing_v2"
  },
  "options": {
    "track_opens": true,
    "track_clicks": true,
    "send_immediately": false,
    "scheduled_time": "2025-12-10T07:00:00+09:00"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `briefing_id` | string | ✅ | 발송할 브리핑 ID |
| `recipients.type` | string | ✅ | `all_subscribers`, `segment`, `specific` |
| `recipients.emails` | array | ❌ | type이 `specific`일 때 이메일 목록 |
| `recipients.filter` | object | ❌ | 구독자 필터 조건 |
| `email_config.subject` | string | ✅ | 이메일 제목 |
| `email_config.template` | string | ❌ | 이메일 템플릿 ID |
| `options.track_opens` | boolean | ❌ | 오픈 추적 여부 |
| `options.send_immediately` | boolean | ❌ | 즉시 발송 여부 |
| `options.scheduled_time` | string | ❌ | 예약 발송 시간 |

#### Response (202 Accepted)
```json
{
  "success": true,
  "data": {
    "delivery": {
      "delivery_id": "dlv_email_20251210_001",
      "briefing_id": "brief_20251210_001",
      "channel": "email",
      "status": "queued",
      "scheduled_time": "2025-12-10T07:00:00+09:00",
      "recipients_count": 7230,
      "estimated_completion": "2025-12-10T07:05:00+09:00"
    },
    "job": {
      "job_id": "job_email_xyz789",
      "status_url": "/v1/delivery/dlv_email_20251210_001/status"
    }
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T06:45:00Z"
  }
}
```

#### Error Cases

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `BRIEFING_NOT_READY` | 브리핑이 아직 생성 중 |
| 400 | `INVALID_RECIPIENTS` | 수신자 지정 오류 |
| 400 | `INVALID_SCHEDULE_TIME` | 과거 시간으로 예약 |
| 404 | `BRIEFING_NOT_FOUND` | 브리핑을 찾을 수 없음 |
| 403 | `ADMIN_REQUIRED` | 관리자 권한 필요 |
| 409 | `DELIVERY_ALREADY_SENT` | 이미 발송된 브리핑 |
| 503 | `EMAIL_SERVICE_UNAVAILABLE` | 이메일 서비스 오류 |

---

### 6.2 슬랙 발송

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **Endpoint** | `/delivery/slack` |
| **Description** | 브리핑을 슬랙 채널로 발송 |
| **Auth Required** | ✅ (Admin) |

#### Request Body

```json
{
  "briefing_id": "brief_20251210_001",
  "channels": {
    "type": "all_connected",
    "filter": {
      "workspace_ids": ["T12345678"]
    }
  },
  "slack_config": {
    "message_format": "rich",
    "include_image": true,
    "include_buttons": true,
    "unfurl_links": false
  },
  "options": {
    "send_immediately": true
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `briefing_id` | string | ✅ | 발송할 브리핑 ID |
| `channels.type` | string | ✅ | `all_connected`, `specific` |
| `channels.webhook_urls` | array | ❌ | type이 `specific`일 때 웹훅 URL 목록 |
| `slack_config.message_format` | string | ❌ | `rich`, `simple` |
| `slack_config.include_image` | boolean | ❌ | 이미지 포함 여부 |
| `options.send_immediately` | boolean | ❌ | 즉시 발송 여부 |

#### Response (202 Accepted)
```json
{
  "success": true,
  "data": {
    "delivery": {
      "delivery_id": "dlv_slack_20251210_001",
      "briefing_id": "brief_20251210_001",
      "channel": "slack",
      "status": "sending",
      "channels_count": 45,
      "started_at": "2025-12-10T07:00:00Z"
    }
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T07:00:00Z"
  }
}
```

---

### 6.3 발송 상태 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **Endpoint** | `/delivery/{delivery_id}/status` |
| **Description** | 발송 진행 상태 및 통계 조회 |
| **Auth Required** | ✅ |

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "delivery_id": "dlv_email_20251210_001",
    "briefing_id": "brief_20251210_001",
    "channel": "email",
    "status": "completed",
    "timing": {
      "scheduled_time": "2025-12-10T07:00:00+09:00",
      "started_at": "2025-12-10T07:00:02Z",
      "completed_at": "2025-12-10T07:04:35Z",
      "duration_seconds": 273
    },
    "stats": {
      "total_recipients": 7230,
      "sent": 7215,
      "failed": 15,
      "bounced": 8,
      "opened": 3265,
      "clicked": 924,
      "unsubscribed": 3
    },
    "rates": {
      "delivery_rate": 0.998,
      "open_rate": 0.452,
      "click_rate": 0.128,
      "unsubscribe_rate": 0.0004
    },
    "failures": [
      {
        "email": "user***@example.com",
        "error": "mailbox_full",
        "timestamp": "2025-12-10T07:01:15Z"
      }
    ]
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T08:00:00Z"
  }
}
```

---

### 6.4 테스트 발송

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **Endpoint** | `/delivery/test` |
| **Description** | 특정 수신자에게 테스트 발송 |
| **Auth Required** | ✅ (Admin) |

#### Request Body

```json
{
  "briefing_id": "brief_20251210_001",
  "channel": "email",
  "test_recipients": [
    "admin@whileyouslept.kr",
    "qa@whileyouslept.kr"
  ]
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "test_delivery": {
      "delivery_id": "dlv_test_001",
      "channel": "email",
      "status": "sent",
      "recipients": ["admin@whileyouslept.kr", "qa@whileyouslept.kr"],
      "sent_at": "2025-12-10T06:50:00Z"
    }
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T06:50:00Z"
  }
}
```

---

## 7. 브리핑 히스토리 조회 API

### 7.1 브리핑 목록 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **Endpoint** | `/briefings` |
| **Description** | 과거 브리핑 목록 조회 |
| **Auth Required** | ✅ |

#### Request Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | ❌ | 1 | 페이지 번호 |
| `limit` | integer | ❌ | 20 | 페이지당 항목 수 |
| `start_date` | string | ❌ | - | 시작 날짜 (YYYY-MM-DD) |
| `end_date` | string | ❌ | - | 종료 날짜 (YYYY-MM-DD) |
| `briefing_type` | string | ❌ | - | `daily`, `weekly`, `special` |
| `status` | string | ❌ | - | `completed`, `scheduled`, `failed` |
| `sort` | string | ❌ | `desc` | 정렬 순서: `asc`, `desc` |

#### Request Example
```http
GET /v1/briefings?start_date=2025-12-01&end_date=2025-12-10&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "briefings": [
      {
        "id": "brief_20251210_001",
        "briefing_type": "daily",
        "target_date": "2025-12-10",
        "title": "🌙 12월 10일 미국 시장 브리핑",
        "status": "completed",
        "top_stock": {
          "symbol": "NVDA",
          "change_percent": 8.32
        },
        "stocks_count": 5,
        "image_thumbnail": "https://cdn.whileyouslept.kr/.../thumb.png",
        "published_at": "2025-12-10T07:00:00+09:00",
        "delivery_stats": {
          "total_sent": 8542,
          "open_rate": 0.452
        }
      },
      {
        "id": "brief_20251209_001",
        "briefing_type": "daily",
        "target_date": "2025-12-09",
        "title": "🌙 12월 9일 미국 시장 브리핑",
        "status": "completed",
        "top_stock": {
          "symbol": "TSLA",
          "change_percent": 6.15
        },
        "stocks_count": 5,
        "image_thumbnail": "https://cdn.whileyouslept.kr/.../thumb.png",
        "published_at": "2025-12-09T07:00:00+09:00",
        "delivery_stats": {
          "total_sent": 8420,
          "open_rate": 0.438
        }
      }
    ]
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T08:00:00Z",
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total_pages": 1,
      "total_items": 10
    }
  }
}
```

---

### 7.2 종목별 언급 히스토리 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **Endpoint** | `/briefings/stocks/{symbol}/history` |
| **Description** | 특정 종목이 언급된 브리핑 히스토리 조회 |
| **Auth Required** | ✅ |

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `symbol` | string | ✅ | 종목 티커 |

#### Request Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | ❌ | 1 | 페이지 번호 |
| `limit` | integer | ❌ | 20 | 페이지당 항목 수 |
| `start_date` | string | ❌ | - | 시작 날짜 |
| `end_date` | string | ❌ | - | 종료 날짜 |

#### Request Example
```http
GET /v1/briefings/stocks/NVDA/history?limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "symbol": "NVDA",
    "name": "NVIDIA Corporation",
    "mention_summary": {
      "total_mentions": 45,
      "as_top_stock": 12,
      "average_rank": 2.3,
      "first_mention": "2025-10-01",
      "last_mention": "2025-12-10"
    },
    "history": [
      {
        "briefing_id": "brief_20251210_001",
        "target_date": "2025-12-10",
        "rank": 1,
        "was_top_stock": true,
        "price": 142.50,
        "change_percent": 8.32,
        "composite_score": 92.4,
        "highlight": "AI 반도체 수요 급증으로 분기 실적 예상치 상회",
        "briefing_url": "/v1/briefings/brief_20251210_001"
      },
      {
        "briefing_id": "brief_20251205_001",
        "target_date": "2025-12-05",
        "rank": 3,
        "was_top_stock": false,
        "price": 135.20,
        "change_percent": 3.45,
        "composite_score": 72.8,
        "highlight": "신규 AI 칩 발표 기대감",
        "briefing_url": "/v1/briefings/brief_20251205_001"
      }
    ],
    "performance_trend": {
      "period_start": "2025-11-10",
      "period_end": "2025-12-10",
      "price_change_percent": 28.5,
      "mention_frequency": "frequently_mentioned"
    }
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T08:00:00Z",
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total_pages": 5,
      "total_items": 45
    }
  }
}
```

---

### 7.3 주간/월간 트렌드 리포트

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **Endpoint** | `/briefings/trends` |
| **Description** | 주간/월간 트렌드 분석 리포트 |
| **Auth Required** | ✅ |

#### Request Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | string | ❌ | `weekly` | `weekly`, `monthly` |
| `target_date` | string | ❌ | - | 기준 날짜 (해당 주/월의 리포트) |

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "trend_report": {
      "period": "weekly",
      "start_date": "2025-12-02",
      "end_date": "2025-12-08",
      "briefings_count": 5
    },
    "top_mentioned_stocks": [
      {
        "rank": 1,
        "symbol": "NVDA",
        "name": "NVIDIA Corporation",
        "mention_count": 5,
        "as_top_stock_count": 3,
        "avg_change_percent": 5.82,
        "sector": "Technology"
      },
      {
        "rank": 2,
        "symbol": "TSLA",
        "name": "Tesla, Inc.",
        "mention_count": 4,
        "as_top_stock_count": 1,
        "avg_change_percent": 4.15,
        "sector": "Consumer Cyclical"
      }
    ],
    "sector_distribution": [
      {
        "sector": "Technology",
        "mention_percent": 45.5,
        "stocks_count": 12
      },
      {
        "sector": "Consumer Cyclical",
        "mention_percent": 22.3,
        "stocks_count": 6
      },
      {
        "sector": "Healthcare",
        "mention_percent": 15.2,
        "stocks_count": 4
      }
    ],
    "market_sentiment": {
      "overall": "bullish",
      "positive_days": 4,
      "negative_days": 1,
      "avg_market_change": 1.25
    },
    "notable_events": [
      {
        "date": "2025-12-05",
        "event": "NVIDIA AI 칩 신제품 발표",
        "impact": "positive",
        "affected_stocks": ["NVDA", "AMD", "TSM"]
      }
    ]
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-12-10T08:00:00Z"
  }
}
```

---

## 8. 에러 코드 정의

### 8.1 HTTP 상태 코드

| Status Code | Description |
|-------------|-------------|
| 200 | 성공 |
| 201 | 리소스 생성 성공 |
| 202 | 요청 접수 (비동기 처리) |
| 400 | 잘못된 요청 |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 409 | 충돌 (중복 등) |
| 422 | 처리 불가능한 엔티티 |
| 429 | 요청 한도 초과 |
| 500 | 서버 내부 오류 |
| 503 | 서비스 이용 불가 |

### 8.2 비즈니스 에러 코드

#### 인증 관련
| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `UNAUTHORIZED` | 401 | 인증 토큰 없음 또는 만료 |
| `INVALID_TOKEN` | 401 | 유효하지 않은 토큰 |
| `TOKEN_EXPIRED` | 401 | 토큰 만료 |
| `ADMIN_REQUIRED` | 403 | 관리자 권한 필요 |

#### 종목 관련
| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_SYMBOL` | 400 | 유효하지 않은 종목 심볼 |
| `STOCK_NOT_FOUND` | 404 | 종목을 찾을 수 없음 |
| `INVALID_SCREENER_TYPE` | 400 | 유효하지 않은 스크리너 타입 |
| `TOO_MANY_SYMBOLS` | 400 | 요청 종목 수 초과 (최대 20개) |

#### 브리핑 관련
| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `BRIEFING_NOT_FOUND` | 404 | 브리핑을 찾을 수 없음 |
| `BRIEFING_NOT_READY` | 400 | 브리핑 생성 중 |
| `BRIEFING_ALREADY_EXISTS` | 409 | 해당 날짜 브리핑 이미 존재 |
| `INVALID_BRIEFING_TYPE` | 400 | 유효하지 않은 브리핑 타입 |
| `INVALID_DATE_FORMAT` | 400 | 잘못된 날짜 형식 |
| `IMAGE_GENERATION_FAILED` | 500 | AI 이미지 생성 실패 |

#### 발송 관련
| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `DELIVERY_ALREADY_SENT` | 409 | 이미 발송된 브리핑 |
| `INVALID_RECIPIENTS` | 400 | 수신자 지정 오류 |
| `INVALID_SCHEDULE_TIME` | 400 | 유효하지 않은 예약 시간 |
| `EMAIL_SERVICE_UNAVAILABLE` | 503 | 이메일 서비스 오류 |
| `SLACK_WEBHOOK_FAILED` | 503 | 슬랙 웹훅 오류 |

#### 데이터 관련
| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `YAHOO_API_ERROR` | 500 | Yahoo Finance API 오류 |
| `DATA_UNAVAILABLE` | 503 | 데이터 수집 실패 |
| `STOCK_DATA_UNAVAILABLE` | 503 | 종목 데이터 없음 |
| `RATE_LIMIT_EXCEEDED` | 429 | API 호출 한도 초과 |

### 8.3 Rate Limiting

| Plan | Requests/Minute | Requests/Day |
|------|-----------------|--------------|
| Free | 60 | 1,000 |
| Pro | 300 | 10,000 |
| Enterprise | 1,000 | Unlimited |

**Rate Limit 헤더**
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1702195200
```

---

## 📎 부록

### A. API 엔드포인트 요약

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/stocks/trending` | 화제 종목 목록 조회 |
| `GET` | `/stocks/trending/top` | TOP 1 화제 종목 조회 |
| `GET` | `/stocks/{symbol}` | 종목 상세 정보 조회 |
| `POST` | `/stocks/batch` | 복수 종목 일괄 조회 |
| `POST` | `/briefings` | 브리핑 생성 |
| `GET` | `/briefings/{id}` | 브리핑 상세 조회 |
| `GET` | `/briefings/{id}/status` | 브리핑 생성 상태 조회 |
| `GET` | `/briefings` | 브리핑 목록 조회 |
| `GET` | `/briefings/stocks/{symbol}/history` | 종목별 언급 히스토리 |
| `GET` | `/briefings/trends` | 트렌드 리포트 |
| `POST` | `/delivery/email` | 이메일 발송 |
| `POST` | `/delivery/slack` | 슬랙 발송 |
| `GET` | `/delivery/{id}/status` | 발송 상태 조회 |
| `POST` | `/delivery/test` | 테스트 발송 |

### B. Webhook 이벤트 (확장 예정)

| Event | Description |
|-------|-------------|
| `briefing.created` | 브리핑 생성 완료 |
| `briefing.failed` | 브리핑 생성 실패 |
| `delivery.completed` | 발송 완료 |
| `delivery.failed` | 발송 실패 |

---

> 📅 문서 작성일: 2025년 12월 10일  
> 📝 버전: v1.0.0  
> ✍️ 작성자: Backend Architecture Team

