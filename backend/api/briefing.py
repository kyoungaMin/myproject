from fastapi import APIRouter, HTTPException
from datetime import datetime
from models.stock import (
    BriefingRequest,
    BriefingResponse,
    ErrorResponse
)
from services.briefing_service import BriefingService

router = APIRouter(
    prefix="/api/briefing",
    tags=["briefing"]
)


@router.post(
    "/generate",
    response_model=BriefingResponse,
    responses={
        404: {"model": ErrorResponse, "description": "종목을 찾을 수 없음"},
        500: {"model": ErrorResponse, "description": "서버 에러"}
    },
    summary="브리핑 생성",
    description="주식 종목에 대한 브리핑 마크다운 콘텐츠를 생성합니다."
)
async def generate_briefing(request: BriefingRequest):
    """
    브리핑 생성

    - **ticker**: 주식 티커 심볼 (예: TSLA, AAPL, NVDA)
    - **type**: 브리핑 타입 (most_actives, day_gainers, day_losers)

    템플릿 기반으로 다음 정보를 포함한 브리핑을 생성합니다:
    - 기업 개요 (회사명, 섹터, 산업 등)
    - 현재 주가 정보 (현재가, 변동률, 거래량 등)
    - 주요 포인트 분석
    - 최근 5일 추세
    - 투자 유의사항
    """
    try:
        # 브리핑 생성
        content = BriefingService.generate_briefing(
            ticker=request.ticker.upper(),
            briefing_type=request.type
        )

        if not content:
            raise HTTPException(
                status_code=404,
                detail=f"종목 '{request.ticker}'의 브리핑을 생성할 수 없습니다. 종목 정보를 확인해주세요."
            )

        # 응답 생성
        return BriefingResponse(
            ticker=request.ticker.upper(),
            type=request.type,
            generated_at=datetime.now().isoformat(),
            content=content
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"브리핑 생성 중 에러가 발생했습니다: {str(e)}"
        )
