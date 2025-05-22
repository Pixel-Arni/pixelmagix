from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import json

Base = declarative_base()

class Page(Base):
    """
    Modell für Landingpages im PixelMagix CMS.
    """
    __tablename__ = "pages"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    html_content = Column(Text, nullable=True)  # GrapesJS HTML
    css_content = Column(Text, nullable=True)   # GrapesJS CSS
    js_content = Column(Text, nullable=True)    # Benutzerdefiniertes JavaScript
    components = Column(Text, nullable=True)    # GrapesJS Komponenten als JSON-String
    styles = Column(Text, nullable=True)        # GrapesJS Stile als JSON-String
    metadata = Column(JSON, nullable=True)      # Zusätzliche Metadaten (SEO, Plugins, etc.)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Beziehungen
    sections = relationship("PageSection", back_populates="page", cascade="all, delete-orphan")
    
    def to_dict(self):
        """
        Konvertiert das Page-Objekt in ein Dictionary.
        """
        return {
            "id": self.id,
            "title": self.title,
            "slug": self.slug,
            "description": self.description,
            "html_content": self.html_content,
            "css_content": self.css_content,
            "js_content": self.js_content,
            "components": json.loads(self.components) if self.components else None,
            "styles": json.loads(self.styles) if self.styles else None,
            "metadata": self.metadata,
            "is_published": self.is_published,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "sections": [section.to_dict() for section in self.sections]
        }


class PageSection(Base):
    """
    Modell für Abschnitte einer Landingpage.
    """
    __tablename__ = "page_sections"
    
    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("pages.id"), nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  # z.B. 'hero', 'features', 'testimonials'
    content = Column(JSON, nullable=True)      # Inhalt des Abschnitts als JSON
    order = Column(Integer, default=0)         # Reihenfolge des Abschnitts
    
    # Beziehungen
    page = relationship("Page", back_populates="sections")
    
    def to_dict(self):
        """
        Konvertiert das PageSection-Objekt in ein Dictionary.
        """
        return {
            "id": self.id,
            "page_id": self.page_id,
            "name": self.name,
            "type": self.type,
            "content": self.content,
            "order": self.order
        }


class Asset(Base):
    """
    Modell für Medien-Assets (Bilder, Videos, etc.).
    """
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_type = Column(String(50), nullable=False)  # z.B. 'image', 'video', 'document'
    mime_type = Column(String(100), nullable=True)
    size = Column(Integer, nullable=True)  # Dateigröße in Bytes
    metadata = Column(JSON, nullable=True)  # Zusätzliche Metadaten
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """
        Konvertiert das Asset-Objekt in ein Dictionary.
        """
        return {
            "id": self.id,
            "name": self.name,
            "file_path": self.file_path,
            "file_type": self.file_type,
            "mime_type": self.mime_type,
            "size": self.size,
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Setting(Base):
    """
    Modell für Systemeinstellungen.
    """
    __tablename__ = "settings"
    
    key = Column(String(255), primary_key=True, index=True)
    value = Column(Text, nullable=True)
    type = Column(String(50), default="string")  # z.B. 'string', 'number', 'boolean', 'json'
    
    def get_typed_value(self):
        """
        Gibt den Wert in seinem korrekten Typ zurück.
        """
        if self.type == "number":
            return float(self.value) if "." in self.value else int(self.value)
        elif self.type == "boolean":
            return self.value.lower() in ("true", "1", "yes")
        elif self.type == "json":
            return json.loads(self.value) if self.value else None
        else:  # string oder andere Typen
            return self.value
    
    def to_dict(self):
        """
        Konvertiert das Setting-Objekt in ein Dictionary.
        """
        return {
            "key": self.key,
            "value": self.get_typed_value(),
            "type": self.type
        }


class Plugin(Base):
    """
    Modell für Plugins im PixelMagix CMS.
    """
    __tablename__ = "plugins"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    version = Column(String(50), nullable=False)
    author = Column(String(255), nullable=True)
    entry_point = Column(String(255), nullable=False)  # Python-Modul als Einstiegspunkt
    is_active = Column(Boolean, default=True)
    config = Column(JSON, nullable=True)  # Plugin-Konfiguration als JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Beziehungen
    hooks = relationship("PluginHook", back_populates="plugin", cascade="all, delete-orphan")
    
    def to_dict(self):
        """
        Konvertiert das Plugin-Objekt in ein Dictionary.
        """
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "version": self.version,
            "author": self.author,
            "entry_point": self.entry_point,
            "is_active": self.is_active,
            "config": self.config,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "hooks": [hook.to_dict() for hook in self.hooks]
        }


class PluginHook(Base):
    """
    Modell für Plugin-Hooks, die bestimmte Aktionen im CMS auslösen können.
    """
    __tablename__ = "plugin_hooks"
    
    id = Column(Integer, primary_key=True, index=True)
    plugin_id = Column(Integer, ForeignKey("plugins.id"), nullable=False)
    hook_name = Column(String(255), nullable=False)  # z.B. 'before_page_save', 'after_page_render'
    handler = Column(String(255), nullable=False)  # Name der Handler-Funktion im Plugin
    priority = Column(Integer, default=10)  # Priorität für die Ausführungsreihenfolge
    
    # Beziehungen
    plugin = relationship("Plugin", back_populates="hooks")
    
    def to_dict(self):
        """
        Konvertiert das PluginHook-Objekt in ein Dictionary.
        """
        return {
            "id": self.id,
            "plugin_id": self.plugin_id,
            "hook_name": self.hook_name,
            "handler": self.handler,
            "priority": self.priority
        }


class AIModel(Base):
    """
    Modell für KI-Modelle zur Inhaltsgenerierung.
    """
    __tablename__ = "ai_models"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    model_type = Column(String(50), nullable=False)  # z.B. 'text', 'image', 'combined'
    provider = Column(String(100), nullable=False)  # z.B. 'local', 'openai', 'huggingface'
    model_path = Column(String(512), nullable=True)  # Pfad zum lokalen Modell oder API-Endpunkt
    config = Column(JSON, nullable=True)  # Modellkonfiguration als JSON
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Beziehungen
    templates = relationship("AITemplate", back_populates="model", cascade="all, delete-orphan")
    
    def to_dict(self):
        """
        Konvertiert das AIModel-Objekt in ein Dictionary.
        """
        return {
            "id": self.id,
            "name": self.name,
            "model_type": self.model_type,
            "provider": self.provider,
            "model_path": self.model_path,
            "config": self.config,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class AITemplate(Base):
    """
    Modell für KI-Vorlagen zur Inhaltsgenerierung.
    """
    __tablename__ = "ai_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    model_id = Column(Integer, ForeignKey("ai_models.id"), nullable=False)
    template_type = Column(String(50), nullable=False)  # z.B. 'page', 'section', 'component'
    prompt_template = Column(Text, nullable=False)  # Template für den KI-Prompt
    output_format = Column(JSON, nullable=True)  # Erwartetes Ausgabeformat als JSON-Schema
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Beziehungen
    model = relationship("AIModel", back_populates="templates")
    
    def to_dict(self):
        """
        Konvertiert das AITemplate-Objekt in ein Dictionary.
        """
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "model_id": self.model_id,
            "template_type": self.template_type,
            "prompt_template": self.prompt_template,
            "output_format": self.output_format,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }