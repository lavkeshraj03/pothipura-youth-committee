from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.core.config import settings
from app.api.v1.api import api_router
from app.db.init_db import init_db
import os

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
FRONTEND_DIR = os.path.join(STATIC_DIR, "frontend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="पोथीपुरा युवा समिति मंच - Production API for Pothipura Youth Committee Platform",
    version="1.0.0",
    lifespan=lifespan
)

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── API Routes (registered BEFORE static mounts) ────────────────────────────
app.include_router(api_router, prefix=settings.API_V1_STR)

# ─── Static Asset Mounts ─────────────────────────────────────────────────────
# Mount /images and /js directly so HTML files can reference /images/... /js/...
frontend_images = os.path.join(FRONTEND_DIR, "images")
frontend_js = os.path.join(FRONTEND_DIR, "js")
frontend_static = os.path.join(FRONTEND_DIR, "static")
receipts_dir = os.path.join(STATIC_DIR, "receipts")

if os.path.exists(frontend_images):
    app.mount("/images", StaticFiles(directory=frontend_images), name="images")
if os.path.exists(frontend_js):
    app.mount("/js", StaticFiles(directory=frontend_js), name="js")
if os.path.exists(frontend_static):
    app.mount("/assets", StaticFiles(directory=frontend_static), name="assets")
if os.path.exists(receipts_dir):
    app.mount("/receipts", StaticFiles(directory=receipts_dir), name="receipts")

# ─── Health Check ────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {
        "status": "online",
        "platform": "Pothipura Youth Committee",
        "event": "श्री कृष्ण जन्माष्टमी महोत्सव - 4 सितम्बर 2026",
        "docs": "/docs"
    }

# ─── Serve Frontend HTML Pages by clean URL ───────────────────────────────────
HTML_PAGES = [
    "index", "janmashtami", "sports", "transparency",
    "committee", "donate", "donors", "schedule",
    "admin", "admin-login"
]

def _make_handler(html_file: str):
    async def _handler():
        if os.path.exists(html_file):
            return FileResponse(html_file, media_type="text/html")
        return {"error": "Page not found"}
    return _handler

# Root → index.html
app.add_api_route(
    "/", _make_handler(os.path.join(FRONTEND_DIR, "index.html")),
    methods=["GET"], include_in_schema=False, name="serve_index"
)

for page in HTML_PAGES:
    _file = os.path.join(FRONTEND_DIR, f"{page}.html")
    _handler = _make_handler(_file)
    _handler.__name__ = f"serve_{page.replace('-','_')}"
    if page != "index":
        app.add_api_route(f"/{page}", _handler, methods=["GET"], include_in_schema=False)
    app.add_api_route(f"/{page}.html", _handler, methods=["GET"], include_in_schema=False)

# ─── Catch-all SPA Fallback ──────────────────────────────────────────────────
@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    target = os.path.join(FRONTEND_DIR, full_path)
    if os.path.exists(target) and os.path.isfile(target):
        return FileResponse(target)
    index_file = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file, media_type="text/html")
    return {"error": "Not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

