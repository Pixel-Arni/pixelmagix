from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from ..db.database import get_db
from ..ai.content_generator import content_generator

router = APIRouter()

@router.get("/models", response_model=Dict[str, Any])
async def get_available_models():
    """
    Gibt eine Liste der verfügbaren KI-Modelle zurück.
    """
    models = content_generator.get_available_models()
    active_model = content_generator.active_model
    
    return {
        "available_models": models,
        "active_model": active_model
    }

@router.post("/set-model", response_model=Dict[str, Any])
async def set_active_model(model_data: Dict[str, str]):
    """
    Setzt das aktive KI-Modell.
    """
    model_name = model_data.get("model_name")
    if not model_name:
        raise HTTPException(status_code=400, detail="Modellname ist erforderlich")
    
    success = content_generator.set_active_model(model_name)
    if not success:
        raise HTTPException(status_code=404, detail=f"Modell '{model_name}' nicht gefunden")
    
    return {
        "message": f"Aktives Modell auf '{model_name}' gesetzt",
        "active_model": model_name
    }

@router.post("/generate-text", response_model=Dict[str, Any])
async def generate_text(prompt_data: Dict[str, Any]):
    """
    Generiert Text mit dem aktiven KI-Modell.
    """
    prompt = prompt_data.get("prompt")
    max_tokens = prompt_data.get("max_tokens", 500)
    
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt ist erforderlich")
    
    if not content_generator.active_model:
        raise HTTPException(status_code=400, detail="Kein aktives KI-Modell verfügbar")
    
    try:
        model = content_generator.models[content_generator.active_model]
        generated_text = model.generate_text(prompt, max_tokens)
        
        return {
            "text": generated_text,
            "model": content_generator.active_model
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler bei der Textgenerierung: {str(e)}")

@router.post("/generate-landing-page", response_model=Dict[str, Any])
async def generate_landing_page(params: Dict[str, Any]):
    """
    Generiert Inhalte für eine komplette Landingpage.
    """
    target_audience = params.get("target_audience", "")
    industry = params.get("industry", "")
    page_goal = params.get("page_goal", "")
    additional_info = params.get("additional_info", "")
    
    if not target_audience or not industry or not page_goal:
        raise HTTPException(
            status_code=400, 
            detail="Zielgruppe, Branche und Seitenziel sind erforderlich"
        )
    
    try:
        content = content_generator.generate_landing_page_content(
            target_audience=target_audience,
            industry=industry,
            page_goal=page_goal,
            additional_info=additional_info
        )
        
        return {
            "content": content,
            "model": content_generator.active_model
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler bei der Inhaltsgenerierung: {str(e)}")

@router.post("/generate-section", response_model=Dict[str, Any])
async def generate_section(params: Dict[str, Any]):
    """
    Generiert Inhalte für einen bestimmten Abschnitt einer Landingpage.
    """
    section_type = params.get("section_type")
    context = params.get("context", {})
    
    if not section_type:
        raise HTTPException(status_code=400, detail="Abschnittstyp ist erforderlich")
    
    try:
        content = content_generator.generate_section_content(
            section_type=section_type,
            context=context
        )
        
        return {
            "content": content,
            "section_type": section_type,
            "model": content_generator.active_model
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler bei der Abschnittsgenerierung: {str(e)}")