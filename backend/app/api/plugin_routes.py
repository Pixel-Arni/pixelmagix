from fastapi import APIRouter, Depends, HTTPException, Body, UploadFile, File
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
import os
import shutil
import zipfile
import json
from pathlib import Path

from ..db.database import get_db
from ..plugins import get_plugin_manager
from ..db.models import Plugin, PluginHook

router = APIRouter(prefix="/api/plugins", tags=["plugins"])


@router.get("/", response_model=List[Dict[str, Any]])
async def get_plugins(db: Session = Depends(get_db)):
    """
    Gibt alle installierten Plugins zurück.
    """
    plugins = db.query(Plugin).all()
    return [plugin.to_dict() for plugin in plugins]


@router.get("/{plugin_slug}", response_model=Dict[str, Any])
async def get_plugin(plugin_slug: str, db: Session = Depends(get_db)):
    """
    Gibt ein bestimmtes Plugin zurück.
    """
    plugin = db.query(Plugin).filter(Plugin.slug == plugin_slug).first()
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin nicht gefunden")
    return plugin.to_dict()


@router.post("/", response_model=Dict[str, Any])
async def install_plugin(plugin_data: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    """
    Installiert ein neues Plugin.
    """
    plugin_manager = get_plugin_manager(db)
    plugin = plugin_manager.install_plugin(plugin_data)
    
    if not plugin:
        raise HTTPException(status_code=500, detail="Fehler bei der Installation des Plugins")
    
    return plugin.to_dict()


@router.post("/upload", response_model=Dict[str, Any])
async def upload_plugin(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Lädt ein Plugin als ZIP-Datei hoch und installiert es.
    """
    plugin_manager = get_plugin_manager(db)
    plugins_dir = Path(plugin_manager.plugins_dir)
    
    # Temporäres Verzeichnis für die Extraktion erstellen
    temp_dir = plugins_dir / "temp"
    os.makedirs(temp_dir, exist_ok=True)
    
    try:
        # ZIP-Datei speichern
        zip_path = temp_dir / file.filename
        with open(zip_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        # ZIP-Datei extrahieren
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(temp_dir)
        
        # plugin.json suchen und lesen
        plugin_json_path = None
        for root, dirs, files in os.walk(temp_dir):
            if "plugin.json" in files:
                plugin_json_path = os.path.join(root, "plugin.json")
                break
        
        if not plugin_json_path:
            raise HTTPException(status_code=400, detail="Ungültiges Plugin-Format: plugin.json nicht gefunden")
        
        # Plugin-Daten lesen
        with open(plugin_json_path, "r") as f:
            plugin_data = json.load(f)
        
        # Plugin-Verzeichnis erstellen
        plugin_dir = plugins_dir / plugin_data["slug"]
        if os.path.exists(plugin_dir):
            shutil.rmtree(plugin_dir)
        
        # Dateien in das Plugin-Verzeichnis kopieren
        plugin_files_dir = os.path.dirname(plugin_json_path)
        shutil.copytree(plugin_files_dir, plugin_dir)
        
        # Plugin installieren
        plugin = plugin_manager.install_plugin(plugin_data)
        if not plugin:
            raise HTTPException(status_code=500, detail="Fehler bei der Installation des Plugins")
        
        return plugin.to_dict()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler beim Hochladen des Plugins: {str(e)}")
    finally:
        # Temporäres Verzeichnis aufräumen
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)


@router.delete("/{plugin_slug}", response_model=Dict[str, Any])
async def uninstall_plugin(plugin_slug: str, db: Session = Depends(get_db)):
    """
    Deinstalliert ein Plugin.
    """
    plugin_manager = get_plugin_manager(db)
    
    # Prüfen, ob das Plugin existiert
    plugin = db.query(Plugin).filter(Plugin.slug == plugin_slug).first()
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin nicht gefunden")
    
    # Plugin deinstallieren
    success = plugin_manager.uninstall_plugin(plugin_slug)
    if not success:
        raise HTTPException(status_code=500, detail="Fehler bei der Deinstallation des Plugins")
    
    # Plugin-Verzeichnis löschen
    plugin_dir = Path(plugin_manager.plugins_dir) / plugin_slug
    if os.path.exists(plugin_dir):
        shutil.rmtree(plugin_dir)
    
    return {"success": True, "message": f"Plugin '{plugin_slug}' erfolgreich deinstalliert"}


@router.put("/{plugin_slug}/activate", response_model=Dict[str, Any])
async def activate_plugin(plugin_slug: str, db: Session = Depends(get_db)):
    """
    Aktiviert ein Plugin.
    """
    plugin = db.query(Plugin).filter(Plugin.slug == plugin_slug).first()
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin nicht gefunden")
    
    plugin.is_active = True
    db.commit()
    db.refresh(plugin)
    
    # Plugin laden
    plugin_manager = get_plugin_manager(db)
    plugin_manager.load_plugin(plugin)
    
    return plugin.to_dict()


@router.put("/{plugin_slug}/deactivate", response_model=Dict[str, Any])
async def deactivate_plugin(plugin_slug: str, db: Session = Depends(get_db)):
    """
    Deaktiviert ein Plugin.
    """
    plugin = db.query(Plugin).filter(Plugin.slug == plugin_slug).first()
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin nicht gefunden")
    
    plugin.is_active = False
    db.commit()
    db.refresh(plugin)
    
    # Plugin aus dem geladenen Zustand entfernen
    plugin_manager = get_plugin_manager(db)
    if plugin_slug in plugin_manager.loaded_plugins:
        # Cleanup-Methode aufrufen, falls vorhanden
        plugin_instance = plugin_manager.loaded_plugins[plugin_slug]
        if hasattr(plugin_instance, "cleanup") and callable(plugin_instance.cleanup):
            try:
                plugin_instance.cleanup()
            except Exception as e:
                pass
        
        del plugin_manager.loaded_plugins[plugin_slug]
    
    return plugin.to_dict()


@router.put("/{plugin_slug}/config", response_model=Dict[str, Any])
async def update_plugin_config(
    plugin_slug: str, 
    config: Dict[str, Any] = Body(...), 
    db: Session = Depends(get_db)
):
    """
    Aktualisiert die Konfiguration eines Plugins.
    """
    plugin = db.query(Plugin).filter(Plugin.slug == plugin_slug).first()
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin nicht gefunden")
    
    plugin.config = config
    db.commit()
    db.refresh(plugin)
    
    # Konfiguration der geladenen Plugin-Instanz aktualisieren
    plugin_manager = get_plugin_manager(db)
    if plugin_slug in plugin_manager.loaded_plugins:
        plugin_manager.loaded_plugins[plugin_slug].config = config
    
    return plugin.to_dict()