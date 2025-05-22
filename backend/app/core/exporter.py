import os
import json
import shutil
from pathlib import Path
from typing import Dict, Any, List, Optional
import logging
from datetime import datetime

from ..db.models import Page, Asset
from ..plugins.base import plugin_manager

# Logger konfigurieren
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PageExporter:
    """
    Klasse zum Exportieren von Landingpages als statische HTML/CSS-Dateien.
    """
    
    def __init__(self, export_dir: Optional[str] = None):
        """
        Initialisiert den PageExporter.
        
        Args:
            export_dir: Verzeichnis für exportierte Seiten (optional)
        """
        # Basisverzeichnis des Projekts ermitteln
        base_dir = Path(__file__).resolve().parent.parent.parent.parent
        
        # Standard-Exportverzeichnis, falls keines angegeben wurde
        if export_dir is None:
            self.export_dir = os.path.join(base_dir, "exports")
        else:
            self.export_dir = export_dir
            
        # Exportverzeichnis erstellen, falls es nicht existiert
        os.makedirs(self.export_dir, exist_ok=True)
    
    def export_page(self, page: Page, output_dir: Optional[str] = None) -> str:
        """
        Exportiert eine Landingpage als statische HTML/CSS-Dateien.
        
        Args:
            page: Das Page-Objekt, das exportiert werden soll
            output_dir: Optionales Ausgabeverzeichnis (falls nicht angegeben, wird ein Unterverzeichnis im export_dir erstellt)
            
        Returns:
            Pfad zum Exportverzeichnis
        """
        # Ausgabeverzeichnis festlegen
        if output_dir is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            page_dir = f"{page.slug}_{timestamp}"
            output_dir = os.path.join(self.export_dir, page_dir)
        
        # Ausgabeverzeichnis erstellen
        os.makedirs(output_dir, exist_ok=True)
        
        # Assets-Verzeichnis erstellen
        assets_dir = os.path.join(output_dir, "assets")
        os.makedirs(assets_dir, exist_ok=True)
        
        # CSS-Datei erstellen
        css_path = os.path.join(output_dir, "style.css")
        with open(css_path, "w", encoding="utf-8") as f:
            f.write(page.css_content or "")
        
        # JavaScript-Datei erstellen (falls vorhanden)
        if page.js_content:
            js_path = os.path.join(output_dir, "script.js")
            with open(js_path, "w", encoding="utf-8") as f:
                f.write(page.js_content)
        
        # HTML-Inhalt vorbereiten
        html_content = self._prepare_html_content(page)
        
        # Plugins die Möglichkeit geben, den HTML-Inhalt zu modifizieren
        html_content = plugin_manager.process_page_export(html_content, page.to_dict())
        
        # HTML-Datei erstellen
        html_path = os.path.join(output_dir, "index.html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        # Metadaten exportieren
        metadata = {
            "page_id": page.id,
            "title": page.title,
            "description": page.description,
            "exported_at": datetime.now().isoformat(),
            "pixelmagix_version": "1.0.0"  # Hier könnte die tatsächliche Version eingesetzt werden
        }
        
        metadata_path = os.path.join(output_dir, "metadata.json")
        with open(metadata_path, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)
        
        logger.info(f"Seite '{page.title}' erfolgreich nach {output_dir} exportiert.")
        return output_dir
    
    def _prepare_html_content(self, page: Page) -> str:
        """
        Bereitet den HTML-Inhalt für den Export vor.
        
        Args:
            page: Das Page-Objekt
            
        Returns:
            Vorbereiteter HTML-Inhalt
        """
        # Basis-HTML-Struktur erstellen
        html = f"""<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{page.title}</title>
    <meta name="description" content="{page.description or ''}">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    {page.html_content or ''}
    
    {f'<script src="script.js"></script>' if page.js_content else ''}
</body>
</html>
"""
        
        return html
    
    def export_assets(self, page_id: int, output_dir: str, assets: List[Asset]) -> None:
        """
        Exportiert die Assets einer Seite.
        
        Args:
            page_id: ID der Seite
            output_dir: Ausgabeverzeichnis
            assets: Liste der zu exportierenden Assets
        """
        assets_dir = os.path.join(output_dir, "assets")
        os.makedirs(assets_dir, exist_ok=True)
        
        for asset in assets:
            try:
                # Quellpfad des Assets
                source_path = asset.file_path
                
                # Zielpfad im Export-Verzeichnis
                target_path = os.path.join(assets_dir, os.path.basename(asset.file_path))
                
                # Asset kopieren
                shutil.copy2(source_path, target_path)
                
                logger.info(f"Asset '{asset.name}' nach {target_path} kopiert.")
            except Exception as e:
                logger.error(f"Fehler beim Exportieren des Assets '{asset.name}': {str(e)}")
    
    def create_zip_archive(self, export_dir: str) -> str:
        """
        Erstellt ein ZIP-Archiv des exportierten Verzeichnisses.
        
        Args:
            export_dir: Pfad zum exportierten Verzeichnis
            
        Returns:
            Pfad zur ZIP-Datei
        """
        import zipfile
        
        # Pfad zur ZIP-Datei
        zip_path = f"{export_dir}.zip"
        
        # ZIP-Archiv erstellen
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for root, _, files in os.walk(export_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, os.path.dirname(export_dir))
                    zipf.write(file_path, arcname)
        
        logger.info(f"ZIP-Archiv erstellt: {zip_path}")
        return zip_path


# Globale Instanz des PageExporters
page_exporter = PageExporter()