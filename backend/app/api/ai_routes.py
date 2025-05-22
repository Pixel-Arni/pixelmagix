from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional

from ..db.database import get_db
from ..ai import get_ai_manager
from ..db.models import AIModel, AITemplate

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.get("/models", response_model=List[Dict[str, Any]])
async def get_ai_models(db: Session = Depends(get_db)):
    """
    Gibt alle verfügbaren KI-Modelle zurück.
    """
    models = db.query(AIModel).filter(AIModel.is_active == True).all()
    return [model.to_dict() for model in models]


@router.get("/templates", response_model=List[Dict[str, Any]])
async def get_ai_templates(db: Session = Depends(get_db)):
    """
    Gibt alle verfügbaren KI-Vorlagen zurück.
    """
    templates = db.query(AITemplate).all()
    return [template.to_dict() for template in templates]


@router.get("/templates/{template_id}", response_model=Dict[str, Any])
async def get_ai_template(template_id: int, db: Session = Depends(get_db)):
    """
    Gibt eine bestimmte KI-Vorlage zurück.
    """
    template = db.query(AITemplate).filter(AITemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Vorlage nicht gefunden")
    return template.to_dict()


@router.post("/generate", response_model=Dict[str, Any])
async def generate_content(
    template_id: int = Body(...),
    variables: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    """
    Generiert Inhalte mit einer KI-Vorlage.
    
    Args:
        template_id: Die ID der zu verwendenden Vorlage
        variables: Variablen, die in den Prompt eingesetzt werden sollen
    """
    ai_manager = get_ai_manager(db)
    result = ai_manager.generate_content(template_id, variables)
    
    if not result:
        raise HTTPException(status_code=500, detail="Fehler bei der Inhaltsgenerierung")
    
    return result


@router.post("/models", response_model=Dict[str, Any])
async def create_ai_model(model_data: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    """
    Registriert ein neues KI-Modell.
    """
    ai_manager = get_ai_manager(db)
    model = ai_manager.register_model(model_data)
    
    if not model:
        raise HTTPException(status_code=500, detail="Fehler bei der Registrierung des Modells")
    
    return model.to_dict()


@router.post("/templates", response_model=Dict[str, Any])
async def create_ai_template(template_data: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    """
    Erstellt eine neue KI-Vorlage.
    """
    ai_manager = get_ai_manager(db)
    template = ai_manager.create_template(template_data)
    
    if not template:
        raise HTTPException(status_code=500, detail="Fehler bei der Erstellung der Vorlage")
    
    return template.to_dict()