import os
import json
from typing import Dict, Any, List, Optional, Union
import logging
from abc import ABC, abstractmethod

# Logger konfigurieren
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIModelInterface(ABC):
    """
    Abstrakte Basisklasse für KI-Modell-Integrationen.
    Implementiere diese Klasse für verschiedene KI-Backends (Ollama, LLaMA.cpp, GPT4All, etc.)
    """
    
    @abstractmethod
    def generate_text(self, prompt: str, max_tokens: int = 500) -> str:
        """
        Generiert Text basierend auf einem Prompt.
        
        Args:
            prompt: Der Eingabetext für das KI-Modell
            max_tokens: Maximale Anzahl der zu generierenden Tokens
            
        Returns:
            Generierter Text
        """
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """
        Prüft, ob das KI-Modell verfügbar ist.
        
        Returns:
            True, wenn das Modell verfügbar ist, sonst False
        """
        pass


class OllamaModel(AIModelInterface):
    """
    Integration für Ollama-Modelle (https://github.com/ollama/ollama)
    """
    
    def __init__(self, model_name: str = "llama2", api_url: str = "http://localhost:11434/api/generate"):
        """
        Initialisiert das Ollama-Modell.
        
        Args:
            model_name: Name des zu verwendenden Modells
            api_url: URL der Ollama-API
        """
        self.model_name = model_name
        self.api_url = api_url
        
    def generate_text(self, prompt: str, max_tokens: int = 500) -> str:
        try:
            import requests
            
            data = {
                "model": self.model_name,
                "prompt": prompt,
                "max_tokens": max_tokens
            }
            
            response = requests.post(self.api_url, json=data)
            if response.status_code == 200:
                return response.json().get("response", "")
            else:
                logger.error(f"Fehler bei der Ollama-API: {response.status_code} - {response.text}")
                return ""
        except Exception as e:
            logger.error(f"Fehler bei der Verwendung von Ollama: {str(e)}")
            return ""
    
    def is_available(self) -> bool:
        try:
            import requests
            response = requests.get(self.api_url.replace("/generate", "/models"))
            return response.status_code == 200
        except Exception:
            return False


class GPT4AllModel(AIModelInterface):
    """
    Integration für GPT4All-Modelle (https://github.com/nomic-ai/gpt4all)
    """
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialisiert das GPT4All-Modell.
        
        Args:
            model_path: Pfad zur Modelldatei (wenn None, wird das Standardmodell verwendet)
        """
        self.model_path = model_path
        self.model = None
        
    def _load_model(self):
        if self.model is None:
            try:
                from gpt4all import GPT4All
                self.model = GPT4All(model_path=self.model_path)
                logger.info(f"GPT4All-Modell geladen: {self.model_path if self.model_path else 'Standard'}")
            except Exception as e:
                logger.error(f"Fehler beim Laden des GPT4All-Modells: {str(e)}")
    
    def generate_text(self, prompt: str, max_tokens: int = 500) -> str:
        try:
            self._load_model()
            if self.model:
                return self.model.generate(prompt, max_tokens=max_tokens)
            return ""
        except Exception as e:
            logger.error(f"Fehler bei der Verwendung von GPT4All: {str(e)}")
            return ""
    
    def is_available(self) -> bool:
        try:
            import gpt4all
            return True
        except ImportError:
            return False


class ContentGenerator:
    """
    Hauptklasse für die Generierung von Inhalten für Landingpages.
    """
    
    def __init__(self):
        self.models: Dict[str, AIModelInterface] = {}
        self.active_model: Optional[str] = None
        
        # Verfügbare Modelle registrieren
        self._register_available_models()
    
    def _register_available_models(self):
        """
        Registriert alle verfügbaren KI-Modelle.
        """
        # Ollama-Modell registrieren
        ollama_model = OllamaModel()
        if ollama_model.is_available():
            self.models["ollama"] = ollama_model
            if self.active_model is None:
                self.active_model = "ollama"
        
        # GPT4All-Modell registrieren
        gpt4all_model = GPT4AllModel()
        if gpt4all_model.is_available():
            self.models["gpt4all"] = gpt4all_model
            if self.active_model is None:
                self.active_model = "gpt4all"
    
    def set_active_model(self, model_name: str) -> bool:
        """
        Setzt das aktive KI-Modell.
        
        Args:
            model_name: Name des zu aktivierenden Modells
            
        Returns:
            True, wenn das Modell erfolgreich aktiviert wurde, sonst False
        """
        if model_name in self.models:
            self.active_model = model_name
            return True
        return False
    
    def get_available_models(self) -> List[str]:
        """
        Gibt eine Liste der verfügbaren KI-Modelle zurück.
        
        Returns:
            Liste der Modellnamen
        """
        return list(self.models.keys())
    
    def generate_landing_page_content(self, 
                                     target_audience: str, 
                                     industry: str, 
                                     page_goal: str,
                                     additional_info: str = "") -> Dict[str, Any]:
        """
        Generiert Inhalte für eine komplette Landingpage.
        
        Args:
            target_audience: Beschreibung der Zielgruppe
            industry: Branche oder Thema
            page_goal: Ziel der Landingpage (z.B. Lead-Generierung, Verkauf)
            additional_info: Zusätzliche Informationen
            
        Returns:
            Dictionary mit generierten Inhalten (Überschriften, Texte, CTA, etc.)
        """
        if not self.active_model or self.active_model not in self.models:
            logger.error("Kein aktives KI-Modell verfügbar.")
            return self._get_fallback_content()
        
        model = self.models[self.active_model]
        
        # Prompt für die Landingpage-Generierung erstellen
        prompt = f"""
        Erstelle Inhalte für eine Landingpage mit folgenden Parametern:
        - Zielgruppe: {target_audience}
        - Branche/Thema: {industry}
        - Ziel der Seite: {page_goal}
        - Zusätzliche Informationen: {additional_info}
        
        Gib die Inhalte im folgenden JSON-Format zurück:
        {{"headline": "Hauptüberschrift",
         "subheadline": "Unterüberschrift",
         "intro_text": "Einleitungstext",
         "features": [{{"title": "Feature 1", "description": "Beschreibung 1"}}, ...],
         "cta_primary": {{"text": "Call-to-Action Text", "action": "Aktion (z.B. URL oder Formular)"}},
         "testimonial": {{"text": "Kundenstimme", "author": "Name", "position": "Position"}},
         "closing_text": "Abschlusstext"}}
        """
        
        try:
            # Text generieren
            generated_text = model.generate_text(prompt, max_tokens=1000)
            
            # JSON aus dem generierten Text extrahieren
            json_start = generated_text.find('{')
            json_end = generated_text.rfind('}')
            
            if json_start >= 0 and json_end > json_start:
                json_str = generated_text[json_start:json_end+1]
                content = json.loads(json_str)
                return content
            else:
                logger.error("Konnte kein gültiges JSON im generierten Text finden.")
                return self._get_fallback_content()
                
        except Exception as e:
            logger.error(f"Fehler bei der Inhaltsgenerierung: {str(e)}")
            return self._get_fallback_content()
    
    def generate_section_content(self, section_type: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generiert Inhalte für einen bestimmten Abschnitt einer Landingpage.
        
        Args:
            section_type: Art des Abschnitts (z.B. 'hero', 'features', 'testimonials')
            context: Kontext für die Generierung (z.B. Zielgruppe, Branche)
            
        Returns:
            Dictionary mit generierten Inhalten für den Abschnitt
        """
        if not self.active_model or self.active_model not in self.models:
            return {"error": "Kein aktives KI-Modell verfügbar."}
        
        model = self.models[self.active_model]
        
        # Prompt basierend auf dem Abschnittstyp erstellen
        prompt = f"Erstelle Inhalte für einen {section_type}-Abschnitt einer Landingpage. "
        prompt += f"Kontext: {json.dumps(context)}"
        
        try:
            # Text generieren
            generated_text = model.generate_text(prompt, max_tokens=500)
            
            # Versuchen, JSON zu extrahieren
            json_start = generated_text.find('{')
            json_end = generated_text.rfind('}')
            
            if json_start >= 0 and json_end > json_start:
                json_str = generated_text[json_start:json_end+1]
                content = json.loads(json_str)
                return content
            else:
                return {"text": generated_text}
                
        except Exception as e:
            logger.error(f"Fehler bei der Abschnittsgenerierung: {str(e)}")
            return {"error": str(e)}
    
    def _get_fallback_content(self) -> Dict[str, Any]:
        """
        Liefert Fallback-Inhalte, wenn die KI-Generierung fehlschlägt.
        
        Returns:
            Dictionary mit Beispielinhalten
        """
        return {
            "headline": "Willkommen auf unserer Landingpage",
            "subheadline": "Wir bieten Lösungen für Ihre Anforderungen",
            "intro_text": "Hier steht ein einleitender Text, der die wichtigsten Vorteile unseres Angebots beschreibt.",
            "features": [
                {"title": "Feature 1", "description": "Beschreibung des ersten Features und seiner Vorteile."},
                {"title": "Feature 2", "description": "Beschreibung des zweiten Features und seiner Vorteile."},
                {"title": "Feature 3", "description": "Beschreibung des dritten Features und seiner Vorteile."}
            ],
            "cta_primary": {"text": "Jetzt starten", "action": "#kontakt"},
            "testimonial": {"text": "Ein begeisterter Kundenkommentar.", "author": "Max Mustermann", "position": "CEO, Beispiel GmbH"},
            "closing_text": "Kontaktieren Sie uns noch heute für weitere Informationen."
        }


# Globale Instanz des ContentGenerators
content_generator = ContentGenerator()