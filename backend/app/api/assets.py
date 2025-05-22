from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import os
import shutil
from pathlib import Path
import uuid
import mimetypes

from ..db.database import get_db
from ..db.models import Asset

router = APIRouter()

# Basisverzeichnis des Projekts ermitteln
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

# Medien-Verzeichnis
MEDIA_DIR = os.path.join(BASE_DIR, "data", "media")
os.makedirs(MEDIA_DIR, exist_ok=True)

@router.get("/", response_model=List[Dict[str, Any]])
async def get_assets(
    skip: int = 0, 
    limit: int = 100, 
    file_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Gibt eine Liste aller Assets zurück.
    """
    query = db.query(Asset)
    
    if file_type:
        query = query.filter(Asset.file_type == file_type)
    
    assets = query.offset(skip).limit(limit).all()
    return [asset.to_dict() for asset in assets]

@router.get("/{asset_id}", response_model=Dict[str, Any])
async def get_asset(asset_id: int, db: Session = Depends(get_db)):
    """
    Gibt ein einzelnes Asset anhand seiner ID zurück.
    """
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if asset is None:
        raise HTTPException(status_code=404, detail="Asset nicht gefunden")
    
    return asset.to_dict()

@router.post("/", response_model=Dict[str, Any])
async def upload_asset(
    file: UploadFile = File(...),
    name: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Lädt ein neues Asset hoch.
    """
    # Dateinamen sichern
    original_filename = file.filename
    file_extension = os.path.splitext(original_filename)[1].lower()
    
    # Eindeutigen Dateinamen generieren
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(MEDIA_DIR, unique_filename)
    
    # Datei speichern
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # MIME-Typ ermitteln
    mime_type, _ = mimetypes.guess_type(file_path)
    
    # Dateityp bestimmen
    file_type = "unknown"
    if mime_type:
        if mime_type.startswith("image/"):
            file_type = "image"
        elif mime_type.startswith("video/"):
            file_type = "video"
        elif mime_type.startswith("audio/"):
            file_type = "audio"
        elif mime_type in ["application/pdf"]:
            file_type = "document"
    
    # Dateigröße ermitteln
    file_size = os.path.getsize(file_path)
    
    # Asset in der Datenbank speichern
    asset_name = name or os.path.splitext(original_filename)[0]
    new_asset = Asset(
        name=asset_name,
        file_path=file_path,
        file_type=file_type,
        mime_type=mime_type,
        size=file_size,
        metadata={
            "original_filename": original_filename
        }
    )
    
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)
    
    return new_asset.to_dict()

@router.delete("/{asset_id}", response_model=Dict[str, Any])
async def delete_asset(asset_id: int, db: Session = Depends(get_db)):
    """
    Löscht ein Asset.
    """
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if asset is None:
        raise HTTPException(status_code=404, detail="Asset nicht gefunden")
    
    # Datei löschen
    try:
        if os.path.exists(asset.file_path):
            os.remove(asset.file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler beim Löschen der Datei: {str(e)}")
    
    # Asset aus der Datenbank löschen
    db.delete(asset)
    db.commit()
    
    return {"message": f"Asset '{asset.name}' wurde gelöscht", "id": asset_id}

@router.get("/file/{asset_id}", response_class=FileResponse)
async def get_asset_file(asset_id: int, db: Session = Depends(get_db)):
    """
    Gibt die Datei eines Assets zurück.
    """
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if asset is None:
        raise HTTPException(status_code=404, detail="Asset nicht gefunden")
    
    if not os.path.exists(asset.file_path):
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")
    
    return FileResponse(
        path=asset.file_path,
        filename=os.path.basename(asset.file_path),
        media_type=asset.mime_type
    )