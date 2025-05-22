from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from ..db.database import get_db
from ..plugins.base import plugin_manager

router = APIRouter()

@router.get("/", response_model=List[Dict[str, Any]])
async def get_plugins():
    """
    Gibt eine Liste aller registrierten Plugins zurück.
    """
    plugins = plugin_manager.get_all_plugins()
    
    return [
        {
            "name": plugin.name,
            "version": plugin.version,
            "description": plugin.description
        }
        for plugin in plugins
    ]

@router.get("/{plugin_name}", response_model=Dict[str, Any])
async def get_plugin(plugin_name: str):
    """
    Gibt Informationen zu einem bestimmten Plugin zurück.
    """
    plugin = plugin_manager.get_plugin(plugin_name)
    if plugin is None:
        raise HTTPException(status_code=404, detail=f"Plugin '{plugin_name}' nicht gefunden")
    
    return {
        "name": plugin.name,
        "version": plugin.version,
        "description": plugin.description,
        "has_frontend_components": bool(plugin.get_frontend_components()),
        "has_editor_blocks": bool(plugin.get_editor_blocks())
    }

@router.get("/{plugin_name}/frontend-components", response_model=Dict[str, Any])
async def get_plugin_frontend_components(plugin_name: str):
    """
    Gibt die Frontend-Komponenten eines Plugins zurück.
    """
    plugin = plugin_manager.get_plugin(plugin_name)
    if plugin is None:
        raise HTTPException(status_code=404, detail=f"Plugin '{plugin_name}' nicht gefunden")
    
    components = plugin.get_frontend_components()
    return {"components": components}

@router.get("/{plugin_name}/editor-blocks", response_model=Dict[str, Any])
async def get_plugin_editor_blocks(plugin_name: str):
    """
    Gibt die Editor-Blöcke eines Plugins zurück.
    """
    plugin = plugin_manager.get_plugin(plugin_name)
    if plugin is None:
        raise HTTPException(status_code=404, detail=f"Plugin '{plugin_name}' nicht gefunden")
    
    blocks = plugin.get_editor_blocks()
    return {"blocks": blocks}

@router.get("/frontend-components/all", response_model=Dict[str, Any])
async def get_all_frontend_components():
    """
    Gibt alle Frontend-Komponenten aller Plugins zurück.
    """
    components = plugin_manager.get_all_frontend_components()
    return {"components": components}

@router.get("/editor-blocks/all", response_model=Dict[str, Any])
async def get_all_editor_blocks():
    """
    Gibt alle Editor-Blöcke aller Plugins zurück.
    """
    blocks = plugin_manager.get_all_editor_blocks()
    return {"blocks": blocks}