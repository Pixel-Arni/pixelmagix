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
from app.plugins.plugin_manager import get_plugin_manager
from app.ai.ai_manager import get_ai_manager
from app.ai.templates import create_default_templates

# API-Router importieren
from app.api.pages import router as pages_router
from app.api.assets import router as assets_router
from app.api.plugin_routes import router as plugin_routes_router
from app.api.ai_routes import router as ai_routes_router

# Basisverzeichnis des Projekts ermitteln
BASE_DIR = Path(__file__).resolve().parent

# FastAPI-App erstellen
app = FastAPI(
    title="PixelMagix CMS",
    description="Ein lokales CMS für Landingpages mit KI-Integration und Plugin-System",
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
    ],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Statische Dateien bereitstellen
static_dir = os.path.join(BASE_DIR, "frontend", "dist")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Medien-Verzeichnis bereitstellen
media_dir = os.path.join(BASE_DIR, "data", "media")
os.makedirs(media_dir, exist_ok=True)
app.mount("/media", StaticFiles(directory=media_dir), name="media")

# API-Router registrieren
app.include_router(pages_router, prefix="/api/pages", tags=["pages"])
app.include_router(assets_router, prefix="/api/assets", tags=["assets"])
app.include_router(plugin_routes_router, prefix="/api/plugins", tags=["plugins"])
app.include_router(ai_routes_router, prefix="/api/ai", tags=["ai"])

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
        
        # Session für Initialisierung erstellen
        db = next(get_db())
        
        try:
            # Plugin-Manager initialisieren
            plugin_manager = get_plugin_manager(db)
            plugin_manager.load_all_plugins()
            print(f"✅ Plugin-Manager initialisiert. {len(plugin_manager.loaded_plugins)} Plugins geladen")
            
            # Plugin-Router registrieren
            for plugin_router in plugin_manager.get_all_routers() if hasattr(plugin_manager, 'get_all_routers') else []:
                app.include_router(plugin_router)
            
            # KI-Manager initialisieren
            ai_manager = get_ai_manager(db)
            print("✅ KI-Manager initialisiert")
            
            # Standardvorlagen erstellen (falls noch nicht vorhanden)
            try:
                create_default_templates(ai_manager)
                print("✅ KI-Standardvorlagen erstellt")
            except Exception as e:
                print(f"⚠️  Warnung bei KI-Vorlagen: {str(e)}")
                
        finally:
            db.close()
            
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
        "description": "Ein lokales CMS für Landingpages mit KI-Integration und Plugin-System",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """
    Gesundheitscheck-Endpunkt.
    """
    return {"status": "healthy", "timestamp": "2024-01-01T00:00:00Z"}

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
    
    # Plugin-Status
    try:
        plugin_manager = get_plugin_manager(db)
        plugin_count = len(plugin_manager.loaded_plugins)
        plugin_status = f"{plugin_count} plugins loaded"
    except Exception as e:
        plugin_status = f"error: {str(e)}"
    
    # KI-Status
    try:
        ai_manager = get_ai_manager(db)
        ai_models = ai_manager.loaded_models
        ai_status = f"{len(ai_models)} models loaded"
    except Exception as e:
        ai_status = f"error: {str(e)}"
    
    return {
        "status": "running",
        "database": db_status,
        "plugins": plugin_status,
        "ai": ai_status,
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