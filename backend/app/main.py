from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import logging
import os

from .db.database import get_db, init_db
from .api import api_router
from .plugins import get_plugin_manager
from .ai import get_ai_manager
from .ai.templates import create_default_templates

# Logger konfigurieren
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# FastAPI-App erstellen
app = FastAPI(
    title="PixelMagix CMS",
    description="Ein lokales CMS für Landingpages mit KI-Integration und Plugin-System",
    version="0.1.0"
)

# CORS-Middleware hinzufügen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Für Produktionsumgebungen einschränken
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API-Router einbinden
app.include_router(api_router)


@app.on_event("startup")
def startup_event():
    """
    Wird beim Start der Anwendung ausgeführt.
    Initialisiert die Datenbank, lädt Plugins und KI-Modelle.
    """
    logger.info("Starte PixelMagix CMS...")
    
    # Datenbank initialisieren
    init_db()
    logger.info("Datenbank initialisiert.")
    
    # Erste DB-Session für die Initialisierung erstellen
    db = next(get_db())
    
    try:
        # Plugin-Manager initialisieren und Plugins laden
        plugin_manager = get_plugin_manager(db)
        logger.info(f"Plugin-Manager initialisiert. {len(plugin_manager.loaded_plugins)} Plugins geladen.")
        
        # KI-Manager initialisieren und Standardvorlagen erstellen
        ai_manager = get_ai_manager(db)
        create_default_templates(ai_manager)
        logger.info("KI-Manager initialisiert und Standardvorlagen erstellt.")
        
    finally:
        db.close()


@app.get("/")
def read_root():
    """
    Root-Endpunkt der API.
    """
    return {
        "name": "PixelMagix CMS",
        "version": "0.1.0",
        "description": "Ein lokales CMS für Landingpages mit KI-Integration und Plugin-System"
    }


@app.get("/health")
def health_check():
    """
    Gesundheitscheck-Endpunkt.
    """
    return {"status": "ok"}


# Wenn die Datei direkt ausgeführt wird
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)