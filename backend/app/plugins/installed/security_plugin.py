from typing import Dict, Any, List, Optional
import json
import secrets
import re
from fastapi import Request, Response, Depends
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

# Plugin-Dekorator importieren
from ...plugins import plugin

@plugin
class SecurityPlugin:
    """
    Ein Plugin für die Verbesserung der Sicherheit des CMS durch CSRF-Schutz und Input-Validierung.
    """
    def __init__(self):
        self.config = {
            "csrf_token_name": "_csrf_token",
            "csrf_header_name": "X-CSRF-Token",
            "csrf_cookie_name": "csrf_token",
            "csrf_cookie_secure": True,
            "csrf_cookie_httponly": True,
            "csrf_cookie_samesite": "Lax",
            "csrf_token_expiry": 3600,  # 1 Stunde in Sekunden
            "excluded_paths": ["/api/auth/login", "/api/auth/logout"],
            "input_validation_rules": {
                "username": {"pattern": r"^[a-zA-Z0-9_]{3,20}$", "error": "Benutzername muss 3-20 Zeichen lang sein und darf nur Buchstaben, Zahlen und Unterstriche enthalten."},
                "email": {"pattern": r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", "error": "Bitte geben Sie eine gültige E-Mail-Adresse ein."},
                "password": {"pattern": r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$", "error": "Passwort muss mindestens 8 Zeichen lang sein und mindestens einen Buchstaben und eine Zahl enthalten."}
            }
        }
        self.tokens = {}  # Speichert aktive CSRF-Tokens: {session_id: token}
    
    def init(self):
        """
        Wird beim Laden des Plugins aufgerufen.
        """
        print(f"Sicherheits-Plugin initialisiert mit Konfiguration: {self.config}")
    
    def register_middleware(self, app):
        """
        Registriert Middleware für CSRF-Schutz.
        
        Args:
            app: Die FastAPI-Anwendung
        """
        class CSRFMiddleware(BaseHTTPMiddleware):
            async def dispatch(self, request: Request, call_next):
                # CSRF-Schutz nur für bestimmte Methoden
                if request.method in ["POST", "PUT", "DELETE", "PATCH"]:
                    # Prüfen, ob der Pfad von der CSRF-Prüfung ausgeschlossen ist
                    path = request.url.path
                    if path not in self.config["excluded_paths"]:
                        # CSRF-Token aus Header oder Cookie extrahieren
                        csrf_token = request.headers.get(self.config["csrf_header_name"])
                        if not csrf_token:
                            cookies = request.cookies
                            csrf_token = cookies.get(self.config["csrf_cookie_name"])
                        
                        # Session-ID aus Cookies extrahieren
                        session_id = request.cookies.get("session_id")
                        
                        # CSRF-Token validieren
                        if not session_id or not csrf_token or not self._validate_csrf_token(session_id, csrf_token):
                            return JSONResponse(
                                status_code=403,
                                content={"detail": "CSRF-Token ungültig oder abgelaufen."}
                            )
                
                # Request weiterleiten
                response = await call_next(request)
                
                # Bei GET-Anfragen neues CSRF-Token generieren und in Cookie setzen
                if request.method == "GET" and "/api/" in request.url.path:
                    session_id = request.cookies.get("session_id")
                    if session_id:
                        csrf_token = self._generate_csrf_token(session_id)
                        response.set_cookie(
                            key=self.config["csrf_cookie_name"],
                            value=csrf_token,
                            httponly=self.config["csrf_cookie_httponly"],
                            secure=self.config["csrf_cookie_secure"],
                            samesite=self.config["csrf_cookie_samesite"]
                        )
                
                return response
        
        # Middleware zur App hinzufügen
        app.add_middleware(CSRFMiddleware)
        
        # Route zum manuellen Abrufen eines CSRF-Tokens hinzufügen
        @app.get("/api/security/csrf-token")
        async def get_csrf_token(request: Request, response: Response):
            session_id = request.cookies.get("session_id")
            if not session_id:
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Nicht authentifiziert."}
                )
            
            csrf_token = self._generate_csrf_token(session_id)
            response.set_cookie(
                key=self.config["csrf_cookie_name"],
                value=csrf_token,
                httponly=self.config["csrf_cookie_httponly"],
                secure=self.config["csrf_cookie_secure"],
                samesite=self.config["csrf_cookie_samesite"]
            )
            
            return {"token": csrf_token}
    
    def _generate_csrf_token(self, session_id: str) -> str:
        """
        Generiert ein neues CSRF-Token für eine Session.
        
        Args:
            session_id: Die Session-ID
            
        Returns:
            str: Das generierte CSRF-Token
        """
        token = secrets.token_hex(32)
        self.tokens[session_id] = token
        return token
    
    def _validate_csrf_token(self, session_id: str, token: str) -> bool:
        """
        Validiert ein CSRF-Token.
        
        Args:
            session_id: Die Session-ID
            token: Das zu validierende Token
            
        Returns:
            bool: True, wenn das Token gültig ist, sonst False
        """
        stored_token = self.tokens.get(session_id)
        if stored_token and stored_token == token:
            return True
        return False
    
    def validate_input(self, field_name: str, value: str) -> Dict[str, Any]:
        """
        Validiert eine Benutzereingabe anhand vordefinierter Regeln.
        
        Args:
            field_name: Der Name des Feldes
            value: Der zu validierende Wert
            
        Returns:
            Dict[str, Any]: Validierungsergebnis mit 'valid' und ggf. 'error'
        """
        if field_name not in self.config["input_validation_rules"]:
            return {"valid": True}
        
        rule = self.config["input_validation_rules"][field_name]
        pattern = rule["pattern"]
        
        if re.match(pattern, value):
            return {"valid": True}
        else:
            return {"valid": False, "error": rule["error"]}
    
    def sanitize_html(self, html_content: str) -> str:
        """
        Bereinigt HTML-Inhalt von potenziell gefährlichen Elementen.
        
        Args:
            html_content: Der zu bereinigende HTML-Inhalt
            
        Returns:
            str: Der bereinigte HTML-Inhalt
        """
        # Einfache Implementierung zum Entfernen von Script-Tags und Event-Handlern
        # In einer realen Anwendung sollte eine robustere Lösung wie z.B. bleach verwendet werden
        html_content = re.sub(r'<script[^>]*>.*?</script>', '', html_content, flags=re.DOTALL)
        html_content = re.sub(r'<[^>]*on\w+=[^>]*>', '', html_content)
        
        return html_content
    
    def after_page_render(self, html_content: str, page_data: Dict[str, Any]) -> str:
        """
        Hook, der nach dem Rendern einer Seite aufgerufen wird.
        Bereinigt den HTML-Inhalt und fügt CSRF-Token-Meta-Tag hinzu.
        
        Args:
            html_content: Der gerenderte HTML-Inhalt
            page_data: Die Seitendaten
            
        Returns:
            str: Der modifizierte HTML-Inhalt
        """
        # HTML-Inhalt bereinigen
        html_content = self.sanitize_html(html_content)
        
        # CSRF-Token-Meta-Tag hinzufügen
        if "<head>" in html_content:
            csrf_meta = f'<meta name="{self.config["csrf_header_name"]}" content="{{csrf_token}}">'  # Platzhalter für serverseitiges Rendering
            html_content = html_content.replace("<head>", f"<head>\n{csrf_meta}")
        
        return html_content
    
    def before_api_request(self, request: Request, endpoint: str) -> Optional[JSONResponse]:
        """
        Hook, der vor einer API-Anfrage aufgerufen wird.
        Validiert Eingabedaten.
        
        Args:
            request: Die FastAPI-Request
            endpoint: Der API-Endpunkt
            
        Returns:
            Optional[JSONResponse]: Fehlerantwort bei ungültigen Eingaben oder None
        """
        try:
            # Nur für bestimmte Endpunkte validieren
            if endpoint in ["register", "update_profile", "create_user"]:
                body = await request.json()
                validation_errors = []
                
                # Felder validieren
                for field_name, value in body.items():
                    if field_name in self.config["input_validation_rules"] and isinstance(value, str):
                        result = self.validate_input(field_name, value)
                        if not result["valid"]:
                            validation_errors.append({"field": field_name, "error": result["error"]})
                
                if validation_errors:
                    return JSONResponse(
                        status_code=400,
                        content={"detail": "Validierungsfehler", "errors": validation_errors}
                    )
            
            return None
        except Exception as e:
            print(f"Fehler bei der Validierung: {str(e)}")
            return None
    
    def cleanup(self):
        """
        Wird beim Deinstallieren des Plugins aufgerufen.
        """
        print("Sicherheits-Plugin wird deinstalliert...")
        self.tokens.clear()