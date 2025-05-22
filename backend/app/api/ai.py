from fastapi import APIRouter, HTTPException
from typing import Dict, Any

router = APIRouter()

@router.get("/models")
async def get_available_models():
    """
    Gibt eine Liste der verfügbaren KI-Modelle zurück.
    """
    return {
        "available_models": ["fallback"],
        "active_model": "fallback"
    }

@router.post("/generate-landing-page")
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
    
    # Einfacher Fallback-Inhaltsgenerator ohne KI
    # In einer realen Implementierung würde hier ein KI-Modell verwendet
    content = generate_fallback_content(target_audience, industry, page_goal, additional_info)
    
    return {
        "content": content,
        "model": "fallback"
    }

def generate_fallback_content(target_audience: str, industry: str, page_goal: str, additional_info: str = "") -> Dict[str, Any]:
    """
    Generiert Fallback-Inhalte ohne KI.
    """
    # Dynamische Inhalte basierend auf den Eingaben
    goal_mapping = {
        "lead_generation": {
            "cta_text": "Jetzt kostenlos anfragen",
            "hero_focus": "Lassen Sie sich unverbindlich beraten"
        },
        "sales": {
            "cta_text": "Jetzt kaufen", 
            "hero_focus": "Profitieren Sie von unserem Angebot"
        },
        "information": {
            "cta_text": "Mehr erfahren",
            "hero_focus": "Informieren Sie sich über unsere Lösungen"
        },
        "newsletter": {
            "cta_text": "Jetzt anmelden",
            "hero_focus": "Bleiben Sie auf dem Laufenden"
        },
        "event": {
            "cta_text": "Jetzt anmelden",
            "hero_focus": "Sichern Sie sich Ihren Platz"
        },
        "download": {
            "cta_text": "Kostenlos herunterladen",
            "hero_focus": "Laden Sie unsere Ressourcen herunter"
        }
    }
    
    goal_info = goal_mapping.get(page_goal, goal_mapping["information"])
    
    return {
        "headline": f"Willkommen bei Ihrer {industry}-Lösung",
        "subheadline": f"Speziell für {target_audience} entwickelt",
        "intro_text": f"Wir bieten maßgeschneiderte Lösungen im Bereich {industry}. {goal_info['hero_focus']} und entdecken Sie, wie wir {target_audience} dabei helfen, ihre Ziele zu erreichen.",
        "features": [
            {
                "title": "Expertise",
                "description": f"Langjährige Erfahrung im Bereich {industry} mit Fokus auf {target_audience}."
            },
            {
                "title": "Maßgeschneidert", 
                "description": f"Individuelle Lösungen, die perfekt zu den Bedürfnissen von {target_audience} passen."
            },
            {
                "title": "Zuverlässig",
                "description": "Vertrauen Sie auf unsere bewährten Methoden und professionelle Umsetzung."
            },
            {
                "title": "Support",
                "description": "Umfassende Betreuung und Support für langfristigen Erfolg."
            }
        ],
        "cta_primary": {
            "text": goal_info["cta_text"],
            "action": "#kontakt"
        },
        "testimonial": {
            "text": f"Dank der professionellen Unterstützung konnten wir unsere Ziele im Bereich {industry} erfolgreich erreichen.",
            "author": "Zufriedener Kunde",
            "position": f"Geschäftsführer, {target_audience}"
        },
        "closing_text": f"Kontaktieren Sie uns noch heute und erfahren Sie, wie wir auch Ihnen im Bereich {industry} helfen können."
    }