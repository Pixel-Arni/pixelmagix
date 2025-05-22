# PixelMagix - Fehlerprüfung und Fehlerbehebung

Diese Anleitung hilft dir, häufige Probleme im PixelMagix CMS zu identifizieren und zu beheben.

## Systemvoraussetzungen prüfen

Stelle sicher, dass dein System die folgenden Mindestanforderungen erfüllt:

- **Python**: Version 3.8 oder höher
  - Überprüfen mit: `python --version`
- **Node.js**: Version 16 oder höher
  - Überprüfen mit: `node --version`
- **npm**: Aktuelle Version
  - Überprüfen mit: `npm --version`

## Bekannte Probleme und Lösungen

### Backend-Probleme

#### Datenbank-Initialisierungsfehler

**Problem**: Die Anwendung kann die Datenbank nicht initialisieren.

**Lösung**:
1. Überprüfe, ob das Verzeichnis `data` existiert und Schreibrechte hat.
2. Lösche die Datei `pixelmagix.db` im `data`-Verzeichnis und starte das Backend neu.

#### API-Endpunkte nicht erreichbar

**Problem**: Frontend kann keine Verbindung zu API-Endpunkten herstellen.

**Lösung**:
1. Stelle sicher, dass der Backend-Server läuft (http://localhost:8000).
2. Überprüfe die CORS-Einstellungen in `backend/main.py`.
3. Teste die API-Endpunkte direkt mit einem Tool wie Postman oder curl.

### Frontend-Probleme

#### Editor lädt nicht

**Problem**: Der GrapesJS-Editor wird nicht korrekt geladen.

**Lösung**:
1. Überprüfe die Browser-Konsole auf JavaScript-Fehler.
2. Stelle sicher, dass alle erforderlichen npm-Pakete installiert sind.
3. Leere den Browser-Cache und versuche es erneut.

#### Styling-Probleme

**Problem**: CSS-Stile werden nicht korrekt angewendet.

**Lösung**:
1. Überprüfe, ob TailwindCSS korrekt konfiguriert ist.
2. Stelle sicher, dass die CSS-Dateien korrekt importiert werden.

### KI-Integration

#### KI-Modell nicht verfügbar

**Problem**: Die KI-Inhaltsgenerierung funktioniert nicht.

**Lösung**:
1. Überprüfe, ob das konfigurierte KI-Modell (Ollama, LLaMA.cpp, GPT4All) installiert ist.
2. Stelle sicher, dass die entsprechenden Python-Pakete installiert sind.
3. Überprüfe die Konfiguration in den Einstellungen.

## Systemdiagnose

### Backend-Diagnose

Führe die folgenden Schritte aus, um das Backend zu überprüfen:

1. Navigiere zum Backend-Verzeichnis:
   ```bash
   cd c:\Users\Arni\Documents\PixelArni\PixelMagix\backend
   ```

2. Überprüfe die installierten Abhängigkeiten:
   ```bash
   pip list
   ```

3. Starte das Backend mit Debug-Logging:
   ```bash
   python main.py --debug
   ```

### Frontend-Diagnose

Führe die folgenden Schritte aus, um das Frontend zu überprüfen:

1. Navigiere zum Frontend-Verzeichnis:
   ```bash
   cd c:\Users\Arni\Documents\PixelArni\PixelMagix\frontend
   ```

2. Überprüfe die installierten Abhängigkeiten:
   ```bash
   npm list --depth=0
   ```

3. Baue das Frontend neu:
   ```bash
   npm run build
   ```

## Leistungsoptimierung

### Backend-Optimierung

- Verwende einen Produktions-WSGI-Server wie Uvicorn mit Gunicorn für bessere Leistung.
- Aktiviere Caching für häufig abgerufene Daten.

### Frontend-Optimierung

- Optimiere Bilder und Assets für schnellere Ladezeiten.
- Verwende Code-Splitting, um die Bundle-Größe zu reduzieren.

## Sicherheitsüberprüfung

### Allgemeine Sicherheitsmaßnahmen

- Halte alle Abhängigkeiten auf dem neuesten Stand.
- Beschränke CORS-Einstellungen auf vertrauenswürdige Domains im Produktivbetrieb.
- Verwende HTTPS für die Kommunikation zwischen Frontend und Backend.

### Datenbanksicherheit

- Stelle sicher, dass die SQLite-Datenbank nicht öffentlich zugänglich ist.
- Implementiere regelmäßige Backups der Datenbank.

## Projektstruktur-Überprüfung

Stelle sicher, dass die folgende Projektstruktur vorhanden und korrekt ist:

```
PixelMagix/
├── backend/                  # FastAPI Backend
│   ├── app/
│   │   ├── api/              # API-Endpunkte
│   │   ├── core/             # Kernfunktionalitäten
│   │   ├── db/               # Datenbankmodelle und -funktionen
│   │   ├── plugins/          # Plugin-System
│   │   ├── ai/               # KI-Integration
│   │   └── utils/            # Hilfsfunktionen
│   ├── main.py               # Hauptanwendung
│   └── requirements.txt      # Python-Abhängigkeiten
├── frontend/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # React-Komponenten
│   │   ├── editor/           # GrapesJS-Integration
│   │   ├── pages/            # Hauptseiten
│   │   ├── plugins/          # Frontend-Plugins
│   │   ├── services/         # API-Dienste
│   │   └── utils/            # Hilfsfunktionen
│   ├── package.json
│   └── tailwind.config.js
├── data/                     # Daten und Datenbank
└── docs/                     # Dokumentation
```

Wenn Verzeichnisse oder Dateien fehlen, erstelle sie mit den entsprechenden Inhalten.

## Nächste Schritte

Nachdem du die Fehlerprüfung abgeschlossen hast, folge der [Anleitung](./anleitung.md), um PixelMagix zu installieren und zu verwenden.