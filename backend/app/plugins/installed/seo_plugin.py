from typing import Dict, Any
import json

# Plugin-Dekorator importieren
from ...plugins import plugin

@plugin
class SEOPlugin:
    """
    Ein Beispiel-Plugin für SEO-Optimierung von Landingpages.
    """
    def __init__(self):
        self.config = {}
    
    def init(self):
        """
        Wird beim Laden des Plugins aufgerufen.
        """
        print(f"SEO-Plugin initialisiert mit Konfiguration: {self.config}")
    
    def before_page_save(self, page_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Hook, der vor dem Speichern einer Seite aufgerufen wird.
        Fügt automatisch Meta-Tags für SEO hinzu.
        
        Args:
            page_data: Die Seitendaten, die gespeichert werden sollen
            
        Returns:
            Dict[str, Any]: Die modifizierten Seitendaten
        """
        # Metadaten initialisieren, falls nicht vorhanden
        if "metadata" not in page_data or page_data["metadata"] is None:
            page_data["metadata"] = {}
        
        # Metadaten für SEO hinzufügen
        if "seo" not in page_data["metadata"]:
            page_data["metadata"]["seo"] = {}
        
        # Titel und Beschreibung für SEO verwenden, falls nicht explizit gesetzt
        seo_data = page_data["metadata"]["seo"]
        if "title" not in seo_data and "title" in page_data:
            seo_data["title"] = page_data["title"]
        
        if "description" not in seo_data and "description" in page_data:
            seo_data["description"] = page_data["description"]
        
        # Standard-Meta-Tags hinzufügen
        if "meta_tags" not in seo_data:
            seo_data["meta_tags"] = []
        
        # Vorhandene Meta-Tags überprüfen und ergänzen
        existing_names = [tag.get("name") for tag in seo_data["meta_tags"] if "name" in tag]
        
        # Standard-Tags hinzufügen, wenn sie noch nicht existieren
        standard_tags = [
            {"name": "robots", "content": "index, follow"},
            {"name": "viewport", "content": "width=device-width, initial-scale=1"},
            {"property": "og:title", "content": seo_data.get("title", page_data.get("title", ""))},
            {"property": "og:description", "content": seo_data.get("description", page_data.get("description", ""))},
            {"property": "og:type", "content": "website"}
        ]
        
        for tag in standard_tags:
            if "name" in tag and tag["name"] not in existing_names:
                seo_data["meta_tags"].append(tag)
            elif "property" in tag and not any(t.get("property") == tag["property"] for t in seo_data["meta_tags"]):
                seo_data["meta_tags"].append(tag)
        
        return page_data
    
    def after_page_render(self, html_content: str, page_data: Dict[str, Any]) -> str:
        """
        Hook, der nach dem Rendern einer Seite aufgerufen wird.
        Fügt SEO-Meta-Tags in den HTML-Header ein.
        
        Args:
            html_content: Der gerenderte HTML-Inhalt
            page_data: Die Seitendaten
            
        Returns:
            str: Der modifizierte HTML-Inhalt
        """
        # Metadaten extrahieren
        metadata = page_data.get("metadata", {})
        seo_data = metadata.get("seo", {})
        meta_tags = seo_data.get("meta_tags", [])
        
        # Meta-Tags als HTML generieren
        meta_html = ""
        for tag in meta_tags:
            if "name" in tag:
                meta_html += f'<meta name="{tag["name"]}" content="{tag["content"]}">'\n"
            elif "property" in tag:
                meta_html += f'<meta property="{tag["property"]}" content="{tag["content"]}">'\n"
        
        # Meta-Tags in den HTML-Header einfügen
        if "<head>" in html_content:
            html_content = html_content.replace("<head>", f"<head>\n{meta_html}")
        
        return html_content
    
    def cleanup(self):
        """
        Wird beim Deinstallieren des Plugins aufgerufen.
        """
        print("SEO-Plugin wird deinstalliert...")