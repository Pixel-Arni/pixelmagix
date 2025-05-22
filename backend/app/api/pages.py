from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import os
import shutil
from datetime import datetime

from ..db.database import get_db
from ..db.models import Page, PageSection
from ..core.exporter import page_exporter

router = APIRouter()

@router.get("/", response_model=List[Dict[str, Any]])
async def get_pages(
    skip: int = 0, 
    limit: int = 100, 
    published_only: bool = False,
    db: Session = Depends(get_db)
):
    """
    Gibt eine Liste aller Landingpages zurück.
    """
    query = db.query(Page)
    
    if published_only:
        query = query.filter(Page.is_published == True)
    
    pages = query.offset(skip).limit(limit).all()
    return [page.to_dict() for page in pages]

@router.get("/{page_id}", response_model=Dict[str, Any])
async def get_page(page_id: int, db: Session = Depends(get_db)):
    """
    Gibt eine einzelne Landingpage anhand ihrer ID zurück.
    """
    page = db.query(Page).filter(Page.id == page_id).first()
    if page is None:
        raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    
    return page.to_dict()

@router.get("/by-slug/{slug}", response_model=Dict[str, Any])
async def get_page_by_slug(slug: str, db: Session = Depends(get_db)):
    """
    Gibt eine einzelne Landingpage anhand ihres Slugs zurück.
    """
    page = db.query(Page).filter(Page.slug == slug).first()
    if page is None:
        raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    
    return page.to_dict()

@router.post("/", response_model=Dict[str, Any])
async def create_page(page_data: Dict[str, Any], db: Session = Depends(get_db)):
    """
    Erstellt eine neue Landingpage.
    """
    # Slug überprüfen
    if "slug" in page_data and db.query(Page).filter(Page.slug == page_data["slug"]).first():
        raise HTTPException(status_code=400, detail="Slug wird bereits verwendet")
    
    # Neue Seite erstellen
    new_page = Page(
        title=page_data.get("title", "Neue Seite"),
        slug=page_data.get("slug", f"page-{datetime.now().strftime('%Y%m%d-%H%M%S')}"),
        description=page_data.get("description"),
        html_content=page_data.get("html_content"),
        css_content=page_data.get("css_content"),
        js_content=page_data.get("js_content"),
        components=page_data.get("components"),
        styles=page_data.get("styles"),
        page_metadata=page_data.get("metadata", {}),
        is_published=page_data.get("is_published", False)
    )
    
    db.add(new_page)
    db.commit()
    db.refresh(new_page)
    
    # Abschnitte hinzufügen, falls vorhanden
    if "sections" in page_data and isinstance(page_data["sections"], list):
        for i, section_data in enumerate(page_data["sections"]):
            section = PageSection(
                page_id=new_page.id,
                name=section_data.get("name", f"Abschnitt {i+1}"),
                type=section_data.get("type", "custom"),
                content=section_data.get("content", {}),
                order=section_data.get("order", i)
            )
            db.add(section)
        
        db.commit()
    
    return new_page.to_dict()

@router.put("/{page_id}", response_model=Dict[str, Any])
async def update_page(page_id: int, page_data: Dict[str, Any], db: Session = Depends(get_db)):
    """
    Aktualisiert eine bestehende Landingpage.
    """
    # Seite finden
    page = db.query(Page).filter(Page.id == page_id).first()
    if page is None:
        raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    
    # Slug überprüfen, falls er geändert wurde
    if "slug" in page_data and page_data["slug"] != page.slug:
        if db.query(Page).filter(Page.slug == page_data["slug"]).first():
            raise HTTPException(status_code=400, detail="Slug wird bereits verwendet")
    
    # Seite aktualisieren
    for key, value in page_data.items():
        if key != "id" and key != "sections" and hasattr(page, key):
            if key == "metadata":
                setattr(page, "page_metadata", value)
            else:
                setattr(page, key, value)
    
    db.commit()
    db.refresh(page)
    
    # Abschnitte aktualisieren, falls vorhanden
    if "sections" in page_data and isinstance(page_data["sections"], list):
        # Bestehende Abschnitte löschen
        db.query(PageSection).filter(PageSection.page_id == page_id).delete()
        
        # Neue Abschnitte hinzufügen
        for i, section_data in enumerate(page_data["sections"]):
            section = PageSection(
                page_id=page.id,
                name=section_data.get("name", f"Abschnitt {i+1}"),
                type=section_data.get("type", "custom"),
                content=section_data.get("content", {}),
                order=section_data.get("order", i)
            )
            db.add(section)
        
        db.commit()
    
    return page.to_dict()

@router.delete("/{page_id}", response_model=Dict[str, Any])
async def delete_page(page_id: int, db: Session = Depends(get_db)):
    """
    Löscht eine Landingpage.
    """
    # Seite finden
    page = db.query(Page).filter(Page.id == page_id).first()
    if page is None:
        raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    
    # Seite löschen
    db.delete(page)
    db.commit()
    
    return {"message": f"Seite '{page.title}' wurde gelöscht", "id": page_id}

@router.post("/{page_id}/export", response_model=Dict[str, Any])
async def export_page(
    page_id: int, 
    background_tasks: BackgroundTasks,
    create_zip: bool = True,
    db: Session = Depends(get_db)
):
    """
    Exportiert eine Landingpage als statische HTML/CSS-Dateien.
    """
    # Seite finden
    page = db.query(Page).filter(Page.id == page_id).first()
    if page is None:
        raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    
    try:
        # Seite exportieren
        export_dir = page_exporter.export_page(page)
        
        # Optional: ZIP-Archiv erstellen
        zip_path = None
        if create_zip:
            zip_path = page_exporter.create_zip_archive(export_dir)
        
        return {
            "message": f"Seite '{page.title}' wurde exportiert",
            "export_dir": export_dir,
            "zip_path": zip_path
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler beim Export: {str(e)}")

@router.get("/{page_id}/download", response_class=FileResponse)
async def download_page_export(page_id: int, db: Session = Depends(get_db)):
    """
    Lädt den Export einer Landingpage als ZIP-Datei herunter.
    """
    # Seite finden
    page = db.query(Page).filter(Page.id == page_id).first()
    if page is None:
        raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    
    try:
        # Seite exportieren und ZIP erstellen
        export_dir = page_exporter.export_page(page)
        zip_path = page_exporter.create_zip_archive(export_dir)
        
        # ZIP-Datei zurückgeben
        return FileResponse(
            path=zip_path,
            filename=f"{page.slug}.zip",
            media_type="application/zip"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler beim Download: {str(e)}")