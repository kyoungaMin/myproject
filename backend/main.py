from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.stocks import router as stocks_router, api_router as stocks_api_router
from api.briefing import router as briefing_router

app = FastAPI(
    title="Stock Analysis API",
    description="FastAPI backend for stock analysis",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3005",
        "http://localhost:3006",
        "http://localhost:3007",  # Next.js 개발 서버
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(stocks_router)
app.include_router(stocks_api_router)
app.include_router(briefing_router)


@app.get("/")
async def root():
    """API 상태 확인"""
    return {
        "message": "Stock Analysis API is running",
        "status": "ok"
    }


@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
