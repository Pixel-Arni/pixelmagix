from typing import Dict, Any
import json

# Beispiel für eine KI-Vorlage zur Generierung von Landingpages

def get_landing_page_template() -> Dict[str, Any]:
    """
    Gibt eine Vorlage für die KI-gestützte Generierung einer Landingpage zurück.
    
    Returns:
        Dict[str, Any]: Die Vorlagendaten für die Datenbank
    """
    return {
        "name": "Standard Landingpage",
        "description": "Generiert eine komplette Landingpage mit Hero-Bereich, Features und Call-to-Action.",
        "template_type": "page",
        "prompt_template": """
        Erstelle eine Landingpage für folgendes Produkt oder Dienstleistung: {product_name}
        
        Beschreibung: {product_description}
        
        Zielgruppe: {target_audience}
        
        Wichtige Funktionen oder Vorteile:
        {features}
        
        Call-to-Action: {call_to_action}
        
        Erstelle eine überzeugende Landingpage mit folgenden Abschnitten:
        1. Hero-Bereich mit Hauptüberschrift und Unterüberschrift
        2. Features-Bereich mit 3-5 wichtigen Funktionen oder Vorteilen
        3. Call-to-Action-Bereich
        
        Gib das Ergebnis als JSON-Struktur zurück, die folgendes Format hat:
        {
            "title": "Seitentitel",
            "description": "Meta-Beschreibung für SEO",
            "sections": [
                {
                    "type": "hero",
                    "content": {
                        "heading": "Hauptüberschrift",
                        "subheading": "Unterüberschrift",
                        "cta_text": "Button-Text",
                        "cta_url": "#kontakt"
                    }
                },
                {
                    "type": "features",
                    "content": {
                        "heading": "Features-Überschrift",
                        "items": [
                            {
                                "title": "Feature 1",
                                "description": "Beschreibung 1",
                                "icon": "icon-name"
                            },
                            // Weitere Features...
                        ]
                    }
                },
                {
                    "type": "cta",
                    "content": {
                        "heading": "Call-to-Action-Überschrift",
                        "text": "Beschreibungstext",
                        "button_text": "Button-Text",
                        "button_url": "#kontakt"
                    }
                }
            ]
        }
        """,
        "output_format": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "description": {"type": "string"},
                "sections": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "type": {"type": "string"},
                            "content": {"type": "object"}
                        },
                        "required": ["type", "content"]
                    }
                }
            },
            "required": ["title", "description", "sections"]
        }
    }


def get_section_template() -> Dict[str, Any]:
    """
    Gibt eine Vorlage für die KI-gestützte Generierung eines Seitenabschnitts zurück.
    
    Returns:
        Dict[str, Any]: Die Vorlagendaten für die Datenbank
    """
    return {
        "name": "Features-Abschnitt",
        "description": "Generiert einen Features-Abschnitt mit Überschrift und Feature-Liste.",
        "template_type": "section",
        "prompt_template": """
        Erstelle einen Features-Abschnitt für folgendes Produkt oder Dienstleistung: {product_name}
        
        Beschreibung: {product_description}
        
        Erstelle 3-5 überzeugende Features mit Titel, Beschreibung und passenden Icon-Namen.
        
        Gib das Ergebnis als JSON-Struktur zurück, die folgendes Format hat:
        {
            "heading": "Features-Überschrift",
            "items": [
                {
                    "title": "Feature 1",
                    "description": "Beschreibung 1",
                    "icon": "icon-name"
                },
                // Weitere Features...
            ]
        }
        """,
        "output_format": {
            "type": "object",
            "properties": {
                "heading": {"type": "string"},
                "items": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string"},
                            "description": {"type": "string"},
                            "icon": {"type": "string"}
                        },
                        "required": ["title", "description"]
                    }
                }
            },
            "required": ["heading", "items"]
        }
    }


# Beispiel für die Verwendung der Vorlagen
def create_default_templates(ai_manager):
    """
    Erstellt Standardvorlagen für die KI-Inhaltsgenerierung.
    
    Args:
        ai_manager: Die AIManager-Instanz
    """
    # Beispiel-Modell erstellen (falls noch nicht vorhanden)
    model_data = {
        "name": "Lokales Textgenerierungsmodell",
        "model_type": "text",
        "provider": "local",
        "model_path": "models/text-generation",
        "config": {
            "max_length": 2048,
            "temperature": 0.7
        }
    }
    
    model = ai_manager.register_model(model_data)
    if model:
        # Landingpage-Vorlage erstellen
        landing_page_template = get_landing_page_template()
        landing_page_template["model_id"] = model.id
        ai_manager.create_template(landing_page_template)
        
        # Abschnitts-Vorlage erstellen
        section_template = get_section_template()
        section_template["model_id"] = model.id
        ai_manager.create_template(section_template)