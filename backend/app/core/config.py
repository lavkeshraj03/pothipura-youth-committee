import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Pothipura Youth Committee Platform"
    PROJECT_HINDI_NAME: str = "पोथीपुरा युवा समिति मंच"
    API_V1_STR: str = "/api/v1"
    
    # Secret Key for JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "village-youth-committee-super-secret-jwt-key-2026-secure")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 Days
    ALGORITHM: str = "HS256"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./pyc.db")
    
    # Storage
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "uploads")
    RECEIPT_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "receipts")
    
    # Admin Credentials for Seeding
    FIRST_SUPERUSER_EMAIL: str = os.getenv("FIRST_SUPERUSER_EMAIL", "admin@villageyouth.org")
    FIRST_SUPERUSER_PASSWORD: str = os.getenv("FIRST_SUPERUSER_PASSWORD", "Admin@123")
    FIRST_SUPERUSER_NAME: str = "पोथीपुरा युवा समिति (Super Admin)"
    
    # CORS — dev + production origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        # Production Vercel frontend
        "https://pothipura-youth-committee.vercel.app",
        "https://*.vercel.app",
        # Production Render (will auto-match if same service)
        "https://pyc-backend.onrender.com",
    ]
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.RECEIPT_DIR, exist_ok=True)
