from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.v1.api import api_router
from app.db.init_db import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Database & Seed initial tables on startup
    await init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ग्राम युवा समिति मंच - Production API for Village Youth Committee Platform (Krishna Janmashtami & Community Hub)",
    version="1.0.0",
    lifespan=lifespan
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

import os
from fastapi.responses import FileResponse

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
FRONTEND_DIR = os.path.join(STATIC_DIR, "frontend")

# Static file mounts for receipts, media uploads, and frontend assets
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health():
    return {
        "status": "online",
        "platform": settings.PROJECT_HINDI_NAME,
        "english_title": settings.PROJECT_NAME,
        "event": "श्री कृष्ण जन्माष्टमी महोत्सव - 4 सितम्बर 2026",
        "docs": "/docs"
    }

@app.get("/")
async def root():
    frontend_index = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(frontend_index):
        return FileResponse(frontend_index)
    return {"message": "Village Youth Committee Platform API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
