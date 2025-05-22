from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from fastapi import APIRouter

class PixelMagixPlugin(ABC):
    """
    Basis-Klasse für alle PixelMagix-Plugins.
    
    Jedes Plugin muss diese Klasse erweitern und die erforderlichen Methoden implementieren.
    Plugins können Frontend-Komponenten, Backend-Endpunkte und Hooks für verschiedene
    Ereignisse im System bereitstellen.
    """
    
    @property
    @abstractmethod
    def name(self) -> str:
        """
        Der eindeutige Name des Plugins.
        """
        pass
    
    @property
    @abstractmethod
    def version(self) -> str:
        """
        Die Version des Plugins im Format X.Y.Z (Semantic Versioning).
        """
        pass
    
    @property
    @abstractmethod
    def description(self) -> str:
        """
        Eine kurze Beschreibung des Plugins.
        """
        pass
    
    @property
    def router(self) -> Optional[APIRouter]:
        """
        Ein optionaler FastAPI-Router für Plugin-spezifische API-Endpunkte.
        """
        return None
    
    def get_frontend_components(self) -> Dict[str, Any]:
        """
        Gibt Frontend-Komponenten zurück, die vom Plugin bereitgestellt werden.
        
        Returns:
            Dict mit Komponenten-IDs als Schlüssel und Komponenten-Definitionen als Werte.
        """
        return {}
    
    def get_editor_blocks(self) -> List[Dict[str, Any]]:
        """
        Gibt benutzerdefinierte GrapesJS-Blöcke zurück, die vom Plugin bereitgestellt werden.
        
        Returns:
            Liste von Block-Definitionen für den GrapesJS-Editor.
        """
        return []
    
    def on_init(self) -> None:
        """
        Wird aufgerufen, wenn das Plugin initialisiert wird.
        """
        pass
    
    def on_page_save(self, page_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Wird aufgerufen, wenn eine Seite gespeichert wird.
        
        Args:
            page_data: Die Seitendaten, die gespeichert werden.
            
        Returns:
            Möglicherweise modifizierte Seitendaten.
        """
        return page_data
    
    def on_page_export(self, html_content: str, page_data: Dict[str, Any]) -> str:
        """
        Wird aufgerufen, wenn eine Seite exportiert wird.
        
        Args:
            html_content: Der HTML-Inhalt der Seite.
            page_data: Die Metadaten der Seite.
            
        Returns:
            Möglicherweise modifizierter HTML-Inhalt.
        """
        return html_content


class PluginManager:
    """
    Verwaltet die Registrierung und Ausführung von Plugins.
    """
    
    def __init__(self):
        self.plugins: Dict[str, PixelMagixPlugin] = {}
        
    def register_plugin(self, plugin: PixelMagixPlugin) -> None:
        """
        Registriert ein Plugin im System.
        
        Args:
            plugin: Die Plugin-Instanz, die registriert werden soll.
        """
        if plugin.name in self.plugins:
            raise ValueError(f"Plugin mit dem Namen '{plugin.name}' ist bereits registriert.")
        
        self.plugins[plugin.name] = plugin
        plugin.on_init()
    
    def get_plugin(self, name: str) -> Optional[PixelMagixPlugin]:
        """
        Gibt ein Plugin anhand seines Namens zurück.
        
        Args:
            name: Der Name des Plugins.
            
        Returns:
            Die Plugin-Instanz oder None, wenn kein Plugin mit diesem Namen gefunden wurde.
        """
        return self.plugins.get(name)
    
    def get_all_plugins(self) -> List[PixelMagixPlugin]:
        """
        Gibt alle registrierten Plugins zurück.
        
        Returns:
            Liste aller Plugin-Instanzen.
        """
        return list(self.plugins.values())
    
    def get_all_routers(self) -> List[APIRouter]:
        """
        Gibt alle API-Router von Plugins zurück.
        
        Returns:
            Liste aller Plugin-Router.
        """
        return [p.router for p in self.plugins.values() if p.router is not None]
    
    def get_all_frontend_components(self) -> Dict[str, Any]:
        """
        Gibt alle Frontend-Komponenten von allen Plugins zurück.
        
        Returns:
            Dict mit Komponenten-IDs als Schlüssel und Komponenten-Definitionen als Werte.
        """
        components = {}
        for plugin in self.plugins.values():
            components.update(plugin.get_frontend_components())
        return components
    
    def get_all_editor_blocks(self) -> List[Dict[str, Any]]:
        """
        Gibt alle GrapesJS-Blöcke von allen Plugins zurück.
        
        Returns:
            Liste aller Block-Definitionen.
        """
        blocks = []
        for plugin in self.plugins.values():
            blocks.extend(plugin.get_editor_blocks())
        return blocks
    
    def process_page_save(self, page_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Verarbeitet das Speichern einer Seite durch alle Plugins.
        
        Args:
            page_data: Die Seitendaten, die gespeichert werden.
            
        Returns:
            Möglicherweise modifizierte Seitendaten.
        """
        result = page_data
        for plugin in self.plugins.values():
            result = plugin.on_page_save(result)
        return result
    
    def process_page_export(self, html_content: str, page_data: Dict[str, Any]) -> str:
        """
        Verarbeitet den Export einer Seite durch alle Plugins.
        
        Args:
            html_content: Der HTML-Inhalt der Seite.
            page_data: Die Metadaten der Seite.
            
        Returns:
            Möglicherweise modifizierter HTML-Inhalt.
        """
        result = html_content
        for plugin in self.plugins.values():
            result = plugin.on_page_export(result, page_data)
        return result

# Globale Plugin-Manager-Instanz
plugin_manager = PluginManager()