import os
import uvicorn
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pathlib import Path

# Interne Module importieren
from app.db.database import init_db, get_db
from app.plugins.base import plugin_manager
from sqlalchemy.orm import Session

# Basisverzeichnis des Projekts ermitteln
BASE_DIR = Path(__file__).resolve().parent.parent

# FastAPI-App erstellen
app = FastAPI(
    title="PixelMagix API",
    description="API für das PixelMagix CMS zur Erstellung von Landingpages",
    version="1.0.0"
)

# CORS-Middleware hinzufügen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Im Produktivbetrieb einschränken
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Statische Dateien bereitstellen
static_dir = os.path.join(BASE_DIR, "frontend", "dist")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Medien-Verzeichnis bereitstellen
media_dir = os.path.join(BASE_DIR, "data", "media")
os.makedirs(media_dir, exist_ok=True)
app.mount("/media", StaticFiles(directory=media_dir), name="media")

# API-Router importieren
from app.api import pages, assets, plugins, ai

# API-Router registrieren
app.include_router(pages.router, prefix="/api/pages", tags=["pages"])
app.include_router(assets.router, prefix="/api/assets", tags=["assets"])
app.include_router(plugins.router, prefix="/api/plugins", tags=["plugins"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

# Plugin-Router registrieren
for plugin_router in plugin_manager.get_all_routers():
    app.include_router(plugin_router)

@app.on_event("startup")
async def startup_event():
    """
    Wird beim Start der Anwendung ausgeführt.
    """
    # Datenbank initialisieren
    init_db()
    
    # Plugins laden
    # Hier könnten Plugins dynamisch geladen werden
    print("PixelMagix CMS gestartet!")

@app.get("/")
async def read_root():
    """
    Root-Endpunkt der API.
    """
    return {"message": "Willkommen bei der PixelMagix API!"}

@app.get("/api/status")
async def get_status(db: Session = Depends(get_db)):
    """
    Gibt den Status der Anwendung zurück.
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
        "plugins": len(plugin_manager.get_all_plugins()),
        "version": "1.0.0"
    }

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Handler für HTTP-Exceptions.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# Hauptfunktion zum Starten der Anwendung
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)