from typing import Dict, Any, List, Optional
import json
import re
import os
import shutil
from pathlib import Path
from datetime import datetime

# Plugin-Dekorator importieren
from ...plugins import plugin

@plugin
class ExportPlugin:
    """
    Ein Plugin für die optimierte Export-Funktionalität zur Generierung von sauberem, SEO-freundlichem HTML-Code.
    """
    def __init__(self):
        self.config = {
            "export_formats": ["html", "static_site", "json"],
            "minify_html": True,
            "include_assets": True,
            "optimize_images": True,
            "add_sitemap": True,
            "add_robots_txt": True,
            "default_export_path": "./exports"
        }
    
    def init(self):
        """
        Wird beim Laden des Plugins aufgerufen.
        """
        print(f"Export-Plugin initialisiert mit Konfiguration: {self.config}")
    
    def export_page(self, page_data: Dict[str, Any], format: str = "html", export_path: Optional[str] = None) -> Dict[str, Any]:
        """
        Exportiert eine Seite in verschiedenen Formaten.
        
        Args:
            page_data: Die zu exportierenden Seitendaten
            format: Das Exportformat (html, static_site, json)
            export_path: Der Pfad, in den exportiert werden soll
            
        Returns:
            Dict[str, Any]: Informationen über den Export
        """
        if format not in self.config["export_formats"]:
            return {"success": False, "error": f"Ungültiges Exportformat: {format}"}
        
        try:
            # Standardpfad verwenden, wenn kein Pfad angegeben wurde
            if not export_path:
                export_path = self.config["default_export_path"]
            
            # Sicherstellen, dass der Exportpfad existiert
            os.makedirs(export_path, exist_ok=True)
            
            # Export je nach Format durchführen
            if format == "html":
                result = self._export_as_html(page_data, export_path)
            elif format == "static_site":
                result = self._export_as_static_site(page_data, export_path)
            elif format == "json":
                result = self._export_as_json(page_data, export_path)
            
            return result
        except Exception as e:
            print(f"Fehler beim Export: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def _export_as_html(self, page_data: Dict[str, Any], export_path: str) -> Dict[str, Any]:
        """
        Exportiert eine Seite als einzelne HTML-Datei.
        
        Args:
            page_data: Die zu exportierenden Seitendaten
            export_path: Der Exportpfad
            
        Returns:
            Dict[str, Any]: Informationen über den Export
        """
        # HTML-Inhalt generieren oder aus page_data extrahieren
        html_content = page_data.get("html_content", "")
        if not html_content and "content" in page_data:
            # Hier würde in einer realen Implementierung der Content in HTML umgewandelt werden
            html_content = f"<h1>{page_data.get('title', '')}</h1>\n<div>{page_data.get('content', '')}</div>"
        
        # HTML optimieren
        html_content = self._optimize_html(html_content, page_data)
        
        # Dateinamen generieren
        slug = page_data.get("slug", "page")
        filename = f"{slug}.html"
        file_path = os.path.join(export_path, filename)
        
        # HTML-Datei schreiben
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        return {
            "success": True,
            "format": "html",
            "file_path": file_path,
            "size": os.path.getsize(file_path)
        }
    
    def _export_as_static_site(self, page_data: Dict[str, Any], export_path: str) -> Dict[str, Any]:
        """
        Exportiert eine Seite als Teil einer statischen Website mit Assets.
        
        Args:
            page_data: Die zu exportierenden Seitendaten
            export_path: Der Exportpfad
            
        Returns:
            Dict[str, Any]: Informationen über den Export
        """
        # Verzeichnisstruktur erstellen
        site_path = os.path.join(export_path, "static_site")
        os.makedirs(site_path, exist_ok=True)
        
        # Assets-Verzeichnisse erstellen
        assets_path = os.path.join(site_path, "assets")
        os.makedirs(os.path.join(assets_path, "css"), exist_ok=True)
        os.makedirs(os.path.join(assets_path, "js"), exist_ok=True)
        os.makedirs(os.path.join(assets_path, "images"), exist_ok=True)
        
        # HTML-Inhalt generieren und optimieren
        html_content = page_data.get("html_content", "")
        if not html_content and "content" in page_data:
            html_content = f"<h1>{page_data.get('title', '')}</h1>\n<div>{page_data.get('content', '')}</div>"
        
        html_content = self._optimize_html(html_content, page_data)
        
        # Dateinamen generieren
        slug = page_data.get("slug", "index")
        filename = f"{slug}.html"
        file_path = os.path.join(site_path, filename)
        
        # HTML-Datei schreiben
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        # Wenn konfiguriert, Sitemap und robots.txt erstellen
        exported_files = [file_path]
        if self.config["add_sitemap"]:
            sitemap_path = self._create_sitemap(site_path, [page_data])
            exported_files.append(sitemap_path)
        
        if self.config["add_robots_txt"]:
            robots_path = self._create_robots_txt(site_path)
            exported_files.append(robots_path)
        
        return {
            "success": True,
            "format": "static_site",
            "site_path": site_path,
            "exported_files": exported_files,
            "file_count": len(exported_files)
        }
    
    def _export_as_json(self, page_data: Dict[str, Any], export_path: str) -> Dict[str, Any]:
        """
        Exportiert eine Seite als JSON-Datei.
        
        Args:
            page_data: Die zu exportierenden Seitendaten
            export_path: Der Exportpfad
            
        Returns:
            Dict[str, Any]: Informationen über den Export
        """
        # Dateinamen generieren
        slug = page_data.get("slug", "page")
        filename = f"{slug}.json"
        file_path = os.path.join(export_path, filename)
        
        # JSON-Datei schreiben
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(page_data, f, ensure_ascii=False, indent=2)
        
        return {
            "success": True,
            "format": "json",
            "file_path": file_path,
            "size": os.path.getsize(file_path)
        }
    
    def _optimize_html(self, html_content: str, page_data: Dict[str, Any]) -> str:
        """
        Optimiert HTML-Inhalt für SEO und Performance.
        
        Args:
            html_content: Der zu optimierende HTML-Inhalt
            page_data: Die Seitendaten für Metainformationen
            
        Returns:
            str: Der optimierte HTML-Inhalt
        """
        # Metadaten extrahieren
        metadata = page_data.get("metadata", {})
        seo_data = metadata.get("seo", {})
        
        # DOCTYPE und HTML-Grundstruktur sicherstellen
        if not html_content.strip().startswith("<!DOCTYPE html>"):
            title = seo_data.get("title", page_data.get("title", "Untitled Page"))
            description = seo_data.get("description", page_data.get("description", ""))
            
            # Basis-HTML-Struktur erstellen
            html_template = f"""<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{description}">
</head>
<body>
    {html_content}
</body>
</html>"""
            
            html_content = html_template
        
        # SEO-Meta-Tags hinzufügen, falls nicht vorhanden
        if "<head>" in html_content and "</head>" in html_content:
            head_content = html_content.split("<head>")[1].split("</head>")[0]
            
            # Meta-Tags für SEO hinzufügen
            meta_tags = []
            
            # Title-Tag prüfen und ggf. hinzufügen
            if "<title>" not in head_content:
                title = seo_data.get("title", page_data.get("title", "Untitled Page"))
                meta_tags.append(f"<title>{title}</title>")
            
            # Description-Meta-Tag prüfen und ggf. hinzufügen
            if "<meta name=\"description\"" not in head_content:
                description = seo_data.get("description", page_data.get("description", ""))
                meta_tags.append(f'<meta name="description" content="{description}">')
            
            # Canonical-Link prüfen und ggf. hinzufügen
            if "<link rel=\"canonical\"" not in head_content and "url" in page_data:
                meta_tags.append(f'<link rel="canonical" href="{page_data["url"]}">')
            
            # Open Graph Tags hinzufügen
            if "<meta property=\"og:title\"" not in head_content:
                title = seo_data.get("title", page_data.get("title", "Untitled Page"))
                meta_tags.append(f'<meta property="og:title" content="{title}">')
            
            if "<meta property=\"og:description\"" not in head_content:
                description = seo_data.get("description", page_data.get("description", ""))
                meta_tags.append(f'<meta property="og:description" content="{description}">')
            
            if "<meta property=\"og:type\"" not in head_content:
                meta_tags.append('<meta property="og:type" content="website">')
            
            if "<meta property=\"og:url\"" not in head_content and "url" in page_data:
                meta_tags.append(f'<meta property="og:url" content="{page_data["url"]}">')
            
            # Meta-Tags in den Head einfügen
            if meta_tags:
                meta_html = "\n    " + "\n    ".join(meta_tags)
                html_content = html_content.replace("<head>", f"<head>{meta_html}")
        
        # HTML minifizieren, wenn konfiguriert
        if self.config["minify_html"]:
            html_content = self._minify_html(html_content)
        
        return html_content
    
    def _minify_html(self, html_content: str) -> str:
        """
        Minifiziert HTML-Inhalt durch Entfernen von Whitespace und Kommentaren.
        
        Args:
            html_content: Der zu minifizierende HTML-Inhalt
            
        Returns:
            str: Der minifizierte HTML-Inhalt
        """
        # Kommentare entfernen (außer IE conditional comments)
        html_content = re.sub(r'<!--(?!\[if)[^\[](.*?)-->', '', html_content, flags=re.DOTALL)
        
        # Mehrfache Leerzeichen reduzieren
        html_content = re.sub(r'\s{2,}', ' ', html_content)
        
        # Leerzeichen zwischen Tags entfernen
        html_content = re.sub(r'>\s+<', '><', html_content)
        
        # Leerzeilen entfernen
        html_content = re.sub(r'\n\s*\n', '\n', html_content)
        
        return html_content.strip()
    
    def _create_sitemap(self, site_path: str, pages: List[Dict[str, Any]]) -> str:
        """
        Erstellt eine sitemap.xml für die exportierte Website.
        
        Args:
            site_path: Der Pfad zur exportierten Website
            pages: Liste der exportierten Seiten
            
        Returns:
            str: Der Pfad zur erstellten sitemap.xml
        """
        sitemap_path = os.path.join(site_path, "sitemap.xml")
        
        # XML-Header
        sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
        sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        
        # URL-Einträge für jede Seite
        for page in pages:
            url = page.get("url", "")
            if not url and "slug" in page:
                url = f"/{page['slug']}.html"
            
            last_modified = page.get("updated_at", datetime.now().strftime("%Y-%m-%d"))
            
            sitemap_content += '  <url>\n'
            sitemap_content += f'    <loc>{url}</loc>\n'
            sitemap_content += f'    <lastmod>{last_modified}</lastmod>\n'
            sitemap_content += '    <changefreq>monthly</changefreq>\n'
            sitemap_content += '    <priority>0.8</priority>\n'
            sitemap_content += '  </url>\n'
        
        # XML-Footer
        sitemap_content += '</urlset>'
        
        # Sitemap-Datei schreiben
        with open(sitemap_path, "w", encoding="utf-8") as f:
            f.write(sitemap_content)
        
        return sitemap_path
    
    def _create_robots_txt(self, site_path: str) -> str:
        """
        Erstellt eine robots.txt für die exportierte Website.
        
        Args:
            site_path: Der Pfad zur exportierten Website
            
        Returns:
            str: Der Pfad zur erstellten robots.txt
        """
        robots_path = os.path.join(site_path, "robots.txt")
        
        # Standard robots.txt-Inhalt
        robots_content = "User-agent: *\n"
        robots_content += "Allow: /\n\n"
        robots_content += "Sitemap: /sitemap.xml\n"
        
        # robots.txt-Datei schreiben
        with open(robots_path, "w", encoding="utf-8") as f:
            f.write(robots_content)
        
        return robots_path
    
    def export_site(self, pages: List[Dict[str, Any]], export_path: Optional[str] = None) -> Dict[str, Any]:
        """
        Exportiert eine komplette Website mit allen Seiten und Assets.
        
        Args:
            pages: Liste der zu exportierenden Seiten
            export_path: Der Exportpfad
            
        Returns:
            Dict[str, Any]: Informationen über den Export
        """
        try:
            # Standardpfad verwenden, wenn kein Pfad angegeben wurde
            if not export_path:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                export_path = os.path.join(self.config["default_export_path"], f"site_export_{timestamp}")
            
            # Sicherstellen, dass der Exportpfad existiert
            os.makedirs(export_path, exist_ok=True)
            
            # Assets-Verzeichnisse erstellen
            assets_path = os.path.join(export_path, "assets")
            os.makedirs(os.path.join(assets_path, "css"), exist_ok=True)
            os.makedirs(os.path.join(assets_path, "js"), exist_ok=True)
            os.makedirs(os.path.join(assets_path, "images"), exist_ok=True)
            
            # Jede Seite exportieren
            exported_files = []
            for page in pages:
                slug = page.get("slug", "page")
                filename = f"{slug}.html" if slug != "index" else "index.html"
                file_path = os.path.join(export_path, filename)
                
                # HTML-Inhalt generieren und optimieren
                html_content = page.get("html_content", "")
                if not html_content and "content" in page:
                    html_content = f"<h1>{page.get('title', '')}</h1>\n<div>{page.get('content', '')}</div>"
                
                html_content = self._optimize_html(html_content, page)
                
                # HTML-Datei schreiben
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(html_content)
                
                exported_files.append(file_path)
            
            # Sitemap und robots.txt erstellen
            if self.config["add_sitemap"]:
                sitemap_path = self._create_sitemap(export_path, pages)
                exported_files.append(sitemap_path)
            
            if self.config["add_robots_txt"]:
                robots_path = self._create_robots_txt(export_path)
                exported_files.append(robots_path)
            
            return {
                "success": True,
                "format": "static_site",
                "site_path": export_path,
                "exported_files": exported_files,
                "file_count": len(exported_files)
            }
        except Exception as e:
            print(f"Fehler beim Export der Website: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def cleanup(self):
        """
        Wird beim Deinstallieren des Plugins aufgerufen.
        """
        print("Export-Plugin wird deinstalliert...")