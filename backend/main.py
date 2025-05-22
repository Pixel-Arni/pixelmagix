import os
import uvicorn
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pathlib import Path
from sqlalchemy.orm import Session

# Interne Module importieren
from app.db.database import init_db, get_db

# API-Router importieren
from app.api.pages import router as pages_router
from app.api.assets import router as assets_router
from app.api.ai import router as ai_router

# Basisverzeichnis des Projekts ermitteln
BASE_DIR = Path(__file__).resolve().parent

# FastAPI-App erstellen
app = FastAPI(
    title="PixelMagix CMS",
    description="Ein lokales CMS für Landingpages mit KI-Integration",
    version="1.0.0"
)

# CORS-Middleware hinzufügen
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Statische Dateien bereitstellen
media_dir = os.path.join(BASE_DIR, "data", "media")
os.makedirs(media_dir, exist_ok=True)
app.mount("/media", StaticFiles(directory=media_dir), name="media")

# API-Router registrieren
app.include_router(pages_router, prefix="/api/pages", tags=["pages"])
app.include_router(assets_router, prefix="/api/assets", tags=["assets"])
app.include_router(ai_router, prefix="/api/ai", tags=["ai"])

@app.on_event("startup")
async def startup_event():
    """
    Wird beim Start der Anwendung ausgeführt.
    """
    print("🚀 Starte PixelMagix CMS...")
    
    try:
        # Datenbank initialisieren
        init_db()
        print("✅ Datenbank initialisiert")
            
    except Exception as e:
        print(f"❌ Fehler beim Startup: {str(e)}")
        raise

@app.get("/")
async def read_root():
    """
    Root-Endpunkt der API.
    """
    return {
        "name": "PixelMagix CMS",
        "version": "1.0.0",
        "description": "Ein lokales CMS für Landingpages mit KI-Integration",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """
    Gesundheitscheck-Endpunkt.
    """
    return {"status": "healthy"}

@app.get("/api/status")
async def get_status(db: Session = Depends(get_db)):
    """
    Gibt den detaillierten Status der Anwendung zurück.
    """
    try:
        # Datenbankverbindung testen
        db.execute("SELECT 1").fetchall()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "running",
        "database": db_status,
        "version": "1.0.0"
    }

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Handler für HTTP-Exceptions.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code,
            "path": str(request.url.path)
        },
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    Handler für allgemeine Exceptions.
    """
    print(f"❌ Unbehandelter Fehler: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Interner Serverfehler",
            "status_code": 500,
            "path": str(request.url.path)
        },
    )

# Hauptfunktion zum Starten der Anwendung
if __name__ == "__main__":
    print("🎯 Starte PixelMagix CMS Server...")
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )