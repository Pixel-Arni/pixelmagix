# PixelMagix - Benutzeranleitung

Diese Anleitung führt dich durch die Installation, Konfiguration und Verwendung des PixelMagix CMS für die Erstellung von Landingpages.

## Inhaltsverzeichnis

1. [Installation](#installation)
2. [Starten der Anwendung](#starten-der-anwendung)
3. [Verwendung des Editors](#verwendung-des-editors)
4. [KI-Inhaltsgenerierung](#ki-inhaltsgenerierung)
5. [Plugins verwenden](#plugins-verwenden)
6. [Export von Landingpages](#export-von-landingpages)
7. [Fehlerbehebung](#fehlerbehebung)

## Installation

### Voraussetzungen

- Python 3.8 oder höher
- Node.js 16 oder höher
- npm oder yarn

### Backend-Installation

1. Öffne ein Terminal und navigiere zum Backend-Verzeichnis:

```bash
cd c:\Users\Arni\Documents\PixelArni\PixelMagix\backend
```

2. Installiere die erforderlichen Python-Abhängigkeiten:

```bash
pip install -r requirements.txt
```

3. (Optional) Für die KI-Integration, installiere je nach gewünschtem Modell:

```bash
# Für GPT4All-Integration
pip install gpt4all>=0.3.0,<0.4.0

# Für LLaMA.cpp-Integration
pip install llama-cpp-python>=0.1.0,<0.2.0
```

### Frontend-Installation

1. Öffne ein Terminal und navigiere zum Frontend-Verzeichnis:

```bash
cd c:\Users\Arni\Documents\PixelArni\PixelMagix\frontend
```

2. Installiere die erforderlichen Node.js-Abhängigkeiten:

```bash
npm install
```

## Starten der Anwendung

### Backend starten

1. Öffne ein Terminal und navigiere zum Backend-Verzeichnis:

```bash
cd c:\Users\Arni\Documents\PixelArni\PixelMagix\backend
```

2. Starte den FastAPI-Server:

```bash
python main.py
```

Der Server wird standardmäßig auf http://localhost:8000 gestartet.

### Frontend starten

1. Öffne ein neues Terminal und navigiere zum Frontend-Verzeichnis:

```bash
cd c:\Users\Arni\Documents\PixelArni\PixelMagix\frontend
```

2. Starte den Entwicklungsserver:

```bash
npm run dev
```

Die Anwendung wird standardmäßig auf http://localhost:5173 gestartet.

3. Öffne einen Webbrowser und navigiere zu http://localhost:5173, um PixelMagix zu verwenden.

## Verwendung des Editors

### Neue Landingpage erstellen

1. Klicke auf der Startseite auf "Neue Landingpage".
2. Der GrapesJS-Editor wird geladen und du kannst mit der Gestaltung beginnen.

### Mit dem Editor arbeiten

- **Komponenten hinzufügen**: Ziehe Elemente aus dem linken Seitenbereich in den Editor.
- **Komponenten bearbeiten**: Klicke auf ein Element im Editor, um seine Eigenschaften im rechten Seitenbereich zu bearbeiten.
- **Stile anpassen**: Verwende den Stil-Manager im rechten Seitenbereich, um das Aussehen der Elemente anzupassen.
- **Responsive Design**: Nutze die Geräteumschalter in der oberen Leiste, um das Layout für verschiedene Bildschirmgrößen zu optimieren.

### Landingpage speichern

- Klicke auf die Schaltfläche "Speichern" in der oberen Leiste, um deine Änderungen zu speichern.
- Du kannst den Titel und die Beschreibung der Seite in den Seiteneinstellungen ändern.

## KI-Inhaltsgenerierung

PixelMagix bietet eine KI-gestützte Inhaltsgenerierung, um schnell Landingpages zu erstellen.

### Voraussetzungen für KI-Funktionen

1. Stelle sicher, dass du ein lokales KI-Modell installiert hast (Ollama, LLaMA.cpp oder GPT4All).
2. Konfiguriere das gewünschte Modell in den Einstellungen.

### Inhalte generieren

1. Klicke im Editor auf die Schaltfläche "KI-Inhalt generieren".
2. Fülle das Formular mit den folgenden Informationen aus:
   - **Zielgruppe**: Beschreibe deine Zielgruppe (z.B. "Kleine Unternehmen im Handwerksbereich").
   - **Branche**: Gib die relevante Branche an (z.B. "Handwerk", "E-Commerce", "Gastronomie").
   - **Seitenziel**: Beschreibe das Ziel der Landingpage (z.B. "Produkt vorstellen", "Newsletter-Anmeldungen sammeln").
   - **Zusätzliche Informationen**: Füge weitere Details hinzu, die für die Inhaltsgenerierung relevant sind.
3. Klicke auf "Generieren", um den Prozess zu starten.
4. Die KI erstellt Inhalte für deine Landingpage, die du anschließend im Editor anpassen kannst.

## Plugins verwenden

PixelMagix unterstützt ein modulares Plugin-System zur Erweiterung der Funktionalität.

### Verfügbare Plugins

- **SEO-Plugin**: Optimiere deine Landingpage für Suchmaschinen.
- **Kontaktformular-Plugin**: Füge interaktive Kontaktformulare hinzu.
- **Cookie-Banner-Plugin**: Integriere DSGVO-konforme Cookie-Banner.

### Plugin aktivieren

1. Navigiere zur Seite "Plugins" in der Hauptnavigation.
2. Wähle das gewünschte Plugin aus der Liste aus.
3. Klicke auf "Aktivieren", um das Plugin zu aktivieren.
4. Konfiguriere die Plugin-Einstellungen nach Bedarf.

## Export von Landingpages

Nach der Fertigstellung kannst du deine Landingpage als statische HTML/CSS-Dateien exportieren.

### Exportieren

1. Öffne die Landingpage im Editor.
2. Klicke auf "Exportieren" in der oberen Leiste.
3. Wähle das gewünschte Exportformat (HTML/CSS).
4. Klicke auf "Exportieren", um den Download zu starten.

### Hosting

Die exportierten Dateien können auf jedem Webhosting-Dienst hochgeladen werden:

1. Lade die exportierten Dateien auf deinen Webserver hoch.
2. Die Landingpage ist nun unter der konfigurierten Domain erreichbar.

## Fehlerbehebung

### Backend startet nicht

- Überprüfe, ob alle erforderlichen Python-Abhängigkeiten installiert sind.
- Stelle sicher, dass der Port 8000 nicht von einer anderen Anwendung verwendet wird.
- Überprüfe die Logs auf Fehlermeldungen.

### Frontend startet nicht

- Überprüfe, ob alle erforderlichen Node.js-Abhängigkeiten installiert sind.
- Stelle sicher, dass der Port 5173 nicht von einer anderen Anwendung verwendet wird.
- Überprüfe die Konsolenausgabe auf Fehlermeldungen.

### KI-Generierung funktioniert nicht

- Stelle sicher, dass das konfigurierte KI-Modell installiert und erreichbar ist.
- Überprüfe, ob die entsprechenden Python-Pakete für das gewählte Modell installiert sind.
- Prüfe die Backend-Logs auf Fehlermeldungen bei der KI-Integration.

### Editor lädt nicht

- Überprüfe, ob das Backend korrekt läuft und erreichbar ist.
- Leere den Browser-Cache und versuche es erneut.
- Prüfe die Browser-Konsole auf JavaScript-Fehler.