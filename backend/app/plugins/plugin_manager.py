from typing import Dict, List, Any, Callable, Optional, Union
import importlib
import inspect
import logging
import os
import sys
from pathlib import Path

from sqlalchemy.orm import Session
from ..db.models import Plugin, PluginHook

logger = logging.getLogger(__name__)

class PluginManager:
    """
    Verwaltet die Plugins im PixelMagix CMS.
    Lädt Plugins, registriert Hooks und führt Plugin-Funktionen aus.
    """
    def __init__(self, db: Session, plugins_dir: str = None):
        self.db = db
        self.plugins_dir = plugins_dir or os.path.join(Path(__file__).parent, "installed")
        self.loaded_plugins: Dict[str, Any] = {}
        self.registered_hooks: Dict[str, List[Dict[str, Any]]] = {}
        
        # Stellen Sie sicher, dass das Plugin-Verzeichnis existiert
        os.makedirs(self.plugins_dir, exist_ok=True)
        
        # Fügen Sie das Plugin-Verzeichnis zum Python-Pfad hinzu
        if self.plugins_dir not in sys.path:
            sys.path.append(self.plugins_dir)
    
    def load_all_plugins(self) -> None:
        """
        Lädt alle aktiven Plugins aus der Datenbank.
        """
        plugins = self.db.query(Plugin).filter(Plugin.is_active == True).all()
        for plugin in plugins:
            self.load_plugin(plugin)
    
    def load_plugin(self, plugin: Plugin) -> bool:
        """
        Lädt ein einzelnes Plugin und registriert seine Hooks.
        
        Args:
            plugin: Das Plugin-Objekt aus der Datenbank.
            
        Returns:
            bool: True, wenn das Plugin erfolgreich geladen wurde, sonst False.
        """
        try:
            # Versuchen, das Plugin-Modul zu importieren
            module_name = plugin.entry_point
            module = importlib.import_module(module_name)
            
            # Plugin-Instanz erstellen, falls eine Plugin-Klasse existiert
            plugin_class = None
            for name, obj in inspect.getmembers(module):
                if inspect.isclass(obj) and hasattr(obj, "__plugin__") and obj.__plugin__ is True:
                    plugin_class = obj
                    break
            
            if plugin_class:
                plugin_instance = plugin_class()
                plugin_instance.config = plugin.config or {}
                self.loaded_plugins[plugin.slug] = plugin_instance
                
                # Hooks registrieren
                for hook in plugin.hooks:
                    self.register_hook(hook.hook_name, getattr(plugin_instance, hook.handler), hook.priority)
                
                # Plugin initialisieren, falls eine init-Methode existiert
                if hasattr(plugin_instance, "init") and callable(plugin_instance.init):
                    plugin_instance.init()
                
                logger.info(f"Plugin '{plugin.name}' erfolgreich geladen.")
                return True
            else:
                logger.warning(f"Keine Plugin-Klasse in '{module_name}' gefunden.")
                return False
                
        except Exception as e:
            logger.error(f"Fehler beim Laden des Plugins '{plugin.name}': {str(e)}")
            return False
    
    def register_hook(self, hook_name: str, handler: Callable, priority: int = 10) -> None:
        """
        Registriert einen Hook-Handler für einen bestimmten Hook-Namen.
        
        Args:
            hook_name: Name des Hooks (z.B. 'before_page_save')
            handler: Die Handler-Funktion, die aufgerufen werden soll
            priority: Priorität für die Ausführungsreihenfolge (niedrigere Werte werden zuerst ausgeführt)
        """
        if hook_name not in self.registered_hooks:
            self.registered_hooks[hook_name] = []
        
        self.registered_hooks[hook_name].append({
            "handler": handler,
            "priority": priority
        })
        
        # Nach Priorität sortieren
        self.registered_hooks[hook_name].sort(key=lambda x: x["priority"])
    
    def execute_hook(self, hook_name: str, *args, **kwargs) -> List[Any]:
        """
        Führt alle Handler für einen bestimmten Hook aus.
        
        Args:
            hook_name: Name des Hooks, der ausgeführt werden soll
            *args, **kwargs: Argumente, die an die Hook-Handler übergeben werden
            
        Returns:
            List[Any]: Liste der Rückgabewerte aller ausgeführten Handler
        """
        results = []
        
        if hook_name in self.registered_hooks:
            for hook_info in self.registered_hooks[hook_name]:
                try:
                    result = hook_info["handler"](*args, **kwargs)
                    results.append(result)
                except Exception as e:
                    logger.error(f"Fehler bei der Ausführung des Hooks '{hook_name}': {str(e)}")
        
        return results
    
    def get_plugin(self, plugin_slug: str) -> Optional[Any]:
        """
        Gibt eine Plugin-Instanz anhand des Slugs zurück.
        
        Args:
            plugin_slug: Der Slug des Plugins
            
        Returns:
            Optional[Any]: Die Plugin-Instanz oder None, wenn das Plugin nicht geladen ist
        """
        return self.loaded_plugins.get(plugin_slug)
    
    def install_plugin(self, plugin_data: Dict[str, Any]) -> Optional[Plugin]:
        """
        Installiert ein neues Plugin in der Datenbank.
        
        Args:
            plugin_data: Die Plugin-Daten (name, slug, description, version, etc.)
            
        Returns:
            Optional[Plugin]: Das erstellte Plugin-Objekt oder None bei Fehler
        """
        try:
            # Prüfen, ob das Plugin bereits existiert
            existing_plugin = self.db.query(Plugin).filter(Plugin.slug == plugin_data["slug"]).first()
            if existing_plugin:
                logger.warning(f"Plugin '{plugin_data['slug']}' existiert bereits.")
                return None
            
            # Neues Plugin erstellen
            plugin = Plugin(
                name=plugin_data["name"],
                slug=plugin_data["slug"],
                description=plugin_data.get("description"),
                version=plugin_data["version"],
                author=plugin_data.get("author"),
                entry_point=plugin_data["entry_point"],
                is_active=plugin_data.get("is_active", True),
                config=plugin_data.get("config", {})
            )
            
            self.db.add(plugin)
            self.db.commit()
            self.db.refresh(plugin)
            
            # Hooks registrieren, falls vorhanden
            if "hooks" in plugin_data and isinstance(plugin_data["hooks"], list):
                for hook_data in plugin_data["hooks"]:
                    hook = PluginHook(
                        plugin_id=plugin.id,
                        hook_name=hook_data["hook_name"],
                        handler=hook_data["handler"],
                        priority=hook_data.get("priority", 10)
                    )
                    self.db.add(hook)
                
                self.db.commit()
            
            logger.info(f"Plugin '{plugin.name}' erfolgreich installiert.")
            return plugin
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Fehler bei der Installation des Plugins: {str(e)}")
            return None
    
    def uninstall_plugin(self, plugin_slug: str) -> bool:
        """
        Deinstalliert ein Plugin aus der Datenbank.
        
        Args:
            plugin_slug: Der Slug des zu deinstallierenden Plugins
            
        Returns:
            bool: True, wenn das Plugin erfolgreich deinstalliert wurde, sonst False
        """
        try:
            plugin = self.db.query(Plugin).filter(Plugin.slug == plugin_slug).first()
            if not plugin:
                logger.warning(f"Plugin '{plugin_slug}' nicht gefunden.")
                return False
            
            # Plugin aus dem geladenen Zustand entfernen
            if plugin_slug in self.loaded_plugins:
                # Cleanup-Methode aufrufen, falls vorhanden
                plugin_instance = self.loaded_plugins[plugin_slug]
                if hasattr(plugin_instance, "cleanup") and callable(plugin_instance.cleanup):
                    try:
                        plugin_instance.cleanup()
                    except Exception as e:
                        logger.error(f"Fehler bei der Cleanup-Methode des Plugins '{plugin_slug}': {str(e)}")
                
                del self.loaded_plugins[plugin_slug]
            
            # Hooks entfernen
            for hook_name in list(self.registered_hooks.keys()):
                self.registered_hooks[hook_name] = [
                    h for h in self.registered_hooks[hook_name]
                    if not (hasattr(h["handler"], "__self__") and 
                           h["handler"].__self__.__class__.__name__ == plugin_slug)
                ]
                
                # Leere Hook-Listen entfernen
                if not self.registered_hooks[hook_name]:
                    del self.registered_hooks[hook_name]
            
            # Plugin aus der Datenbank entfernen
            self.db.delete(plugin)
            self.db.commit()
            
            logger.info(f"Plugin '{plugin_slug}' erfolgreich deinstalliert.")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Fehler bei der Deinstallation des Plugins '{plugin_slug}': {str(e)}")
            return False


# Dekorator für Plugin-Klassen
def plugin(cls):
    """
    Dekorator, um eine Klasse als Plugin zu markieren.
    
    Beispiel:
        @plugin
        class MyPlugin:
            def init(self):
                # Plugin-Initialisierung
                pass
    """
    cls.__plugin__ = True
    return cls


# Singleton-Instanz des PluginManagers
_plugin_manager_instance = None

def get_plugin_manager(db: Session) -> PluginManager:
    """
    Gibt die Singleton-Instanz des PluginManagers zurück.
    
    Args:
        db: Die Datenbankverbindung
        
    Returns:
        PluginManager: Die Singleton-Instanz des PluginManagers
    """
    global _plugin_manager_instance
    if _plugin_manager_instance is None:
        _plugin_manager_instance = PluginManager(db)
        _plugin_manager_instance.load_all_plugins()
    return _plugin_manager_instance