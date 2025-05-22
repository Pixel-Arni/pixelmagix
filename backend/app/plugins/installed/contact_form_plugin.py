from typing import Dict, Any
import json
from fastapi import Request
from fastapi.responses import JSONResponse

# Plugin-Dekorator importieren
from ...plugins import plugin

@plugin
class ContactFormPlugin:
    """
    Ein Plugin für die Integration eines Kontaktformulars in Landingpages.
    Demonstriert die Interaktion zwischen Plugin und Frontend.
    """
    def __init__(self):
        self.config = {
            "email_recipient": "",
            "success_message": "Vielen Dank für Ihre Nachricht. Wir werden uns in Kürze bei Ihnen melden.",
            "error_message": "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut."
        }
    
    def init(self):
        """
        Wird beim Laden des Plugins aufgerufen.
        """
        print(f"Kontaktformular-Plugin initialisiert mit Konfiguration: {self.config}")
    
    def register_routes(self, app):
        """
        Registriert API-Routen für das Kontaktformular.
        
        Args:
            app: Die FastAPI-Anwendung
        """
        @app.post("/api/contact-form/submit")
        async def submit_contact_form(request: Request):
            try:
                form_data = await request.json()
                # Hier würde in einer realen Anwendung die E-Mail-Versendung erfolgen
                # Für dieses Beispiel nur Logging
                print(f"Kontaktformular-Daten empfangen: {form_data}")
                
                # Validierung der Eingaben
                if not self._validate_form_data(form_data):
                    return JSONResponse(
                        status_code=400,
                        content={"success": False, "message": "Ungültige Formulardaten"}
                    )
                
                return JSONResponse(
                    status_code=200,
                    content={"success": True, "message": self.config["success_message"]}
                )
            except Exception as e:
                print(f"Fehler bei der Verarbeitung des Kontaktformulars: {str(e)}")
                return JSONResponse(
                    status_code=500,
                    content={"success": False, "message": self.config["error_message"]}
                )
    
    def _validate_form_data(self, form_data: Dict[str, Any]) -> bool:
        """
        Validiert die Formulardaten.
        
        Args:
            form_data: Die zu validierenden Formulardaten
            
        Returns:
            bool: True, wenn die Daten gültig sind, sonst False
        """
        required_fields = ["name", "email", "message"]
        for field in required_fields:
            if field not in form_data or not form_data[field]:
                return False
        
        # Einfache E-Mail-Validierung
        email = form_data.get("email", "")
        if not "@" in email or not "." in email:
            return False
            
        return True
    
    def before_page_save(self, page_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Hook, der vor dem Speichern einer Seite aufgerufen wird.
        Fügt Kontaktformular-Komponente hinzu, wenn in den Metadaten aktiviert.
        
        Args:
            page_data: Die Seitendaten, die gespeichert werden sollen
            
        Returns:
            Dict[str, Any]: Die modifizierten Seitendaten
        """
        # Metadaten initialisieren, falls nicht vorhanden
        if "metadata" not in page_data or page_data["metadata"] is None:
            page_data["metadata"] = {}
        
        # Kontaktformular-Metadaten initialisieren
        if "contact_form" not in page_data["metadata"]:
            page_data["metadata"]["contact_form"] = {"enabled": False}
        
        return page_data
    
    def after_page_render(self, html_content: str, page_data: Dict[str, Any]) -> str:
        """
        Hook, der nach dem Rendern einer Seite aufgerufen wird.
        Fügt das Kontaktformular-HTML ein, wenn aktiviert.
        
        Args:
            html_content: Der gerenderte HTML-Inhalt
            page_data: Die Seitendaten
            
        Returns:
            str: Der modifizierte HTML-Inhalt
        """
        # Prüfen, ob Kontaktformular aktiviert ist
        metadata = page_data.get("metadata", {})
        contact_form_data = metadata.get("contact_form", {})
        
        if not contact_form_data.get("enabled", False):
            return html_content
        
        # Kontaktformular-HTML generieren
        form_html = self._generate_contact_form_html(contact_form_data)
        
        # Kontaktformular in den HTML-Body einfügen
        if "</body>" in html_content:
            html_content = html_content.replace("</body>", f"{form_html}\n</body>")
        
        return html_content
    
    def _generate_contact_form_html(self, form_data: Dict[str, Any]) -> str:
        """
        Generiert das HTML für das Kontaktformular.
        
        Args:
            form_data: Die Konfigurationsdaten für das Formular
            
        Returns:
            str: Das generierte HTML
        """
        title = form_data.get("title", "Kontaktieren Sie uns")
        subtitle = form_data.get("subtitle", "Wir freuen uns auf Ihre Nachricht")
        
        html = f'''
        <div class="contact-form-container" id="contact-form">
            <div class="contact-form-inner">
                <h2>{title}</h2>
                <p>{subtitle}</p>
                <form id="contact-form-element" onsubmit="submitContactForm(event)">
                    <div class="form-group">
                        <label for="name">Name *</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">E-Mail *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Telefon</label>
                        <input type="tel" id="phone" name="phone">
                    </div>
                    <div class="form-group">
                        <label for="message">Nachricht *</label>
                        <textarea id="message" name="message" rows="5" required></textarea>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="submit-button">Senden</button>
                    </div>
                    <div id="form-response" class="hidden"></div>
                </form>
            </div>
        </div>
        
        <style>
            .contact-form-container {
                max-width: 600px;
                margin: 2rem auto;
                padding: 2rem;
                background-color: #f8f9fa;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .contact-form-inner {
                width: 100%;
            }
            .form-group {
                margin-bottom: 1.5rem;
            }
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
            }
            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 1rem;
            }
            .submit-button {
                background-color: #007bff;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                font-size: 1rem;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            .submit-button:hover {
                background-color: #0069d9;
            }
            #form-response {
                margin-top: 1rem;
                padding: 1rem;
                border-radius: 4px;
            }
            #form-response.success {
                background-color: #d4edda;
                color: #155724;
            }
            #form-response.error {
                background-color: #f8d7da;
                color: #721c24;
            }
            .hidden {
                display: none;
            }
        </style>
        
        <script>
            function submitContactForm(event) {
                event.preventDefault();
                
                const form = document.getElementById('contact-form-element');
                const formResponse = document.getElementById('form-response');
                const formData = {
                    name: form.elements.name.value,
                    email: form.elements.email.value,
                    phone: form.elements.phone.value,
                    message: form.elements.message.value
                };
                
                formResponse.className = 'hidden';
                
                fetch('/api/contact-form/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    formResponse.textContent = data.message;
                    formResponse.className = data.success ? 'success' : 'error';
                    
                    if (data.success) {
                        form.reset();
                    }
                })
                .catch(error => {
                    console.error('Fehler:', error);
                    formResponse.textContent = 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.';
                    formResponse.className = 'error';
                });
            }
        </script>
        '''
        
        return html
    
    def cleanup(self):
        """
        Wird beim Deinstallieren des Plugins aufgerufen.
        """
        print("Kontaktformular-Plugin wird deinstalliert...")