# PixelMagix Projektstruktur

```
PixelMagix/
├── backend/                  # FastAPI Backend
│   ├── app/
│   │   ├── api/              # API-Endpunkte
│   │   ├── core/             # Kernfunktionalitäten
│   │   ├── db/               # Datenbankmodelle und -funktionen
│   │   ├── plugins/          # Plugin-System
│   │   │   └── base.py       # Basis-Plugin-Klasse
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
│   └── pixelmagix.db         # SQLite-Datenbank
└── docs/                     # Dokumentation
```

## Komponenten-Übersicht

### Backend

- **API**: RESTful-Endpunkte für Frontend-Kommunikation
- **Core**: Kernfunktionalitäten wie Seitenmanagement und Export
- **DB**: SQLite-Datenbankmodelle und -operationen
- **Plugins**: Modulares Plugin-System
- **AI**: Integration lokaler KI-Modelle

### Frontend

- **Editor**: GrapesJS-Integration für visuelles Editieren
- **Components**: Wiederverwendbare UI-Komponenten
- **Pages**: Hauptseiten der Anwendung
- **Services**: API-Kommunikation mit dem Backend

### Datenfluss

1. Benutzer interagiert mit dem React-Frontend
2. Frontend kommuniziert mit Backend-API
3. Backend verarbeitet Anfragen, interagiert mit Datenbank und Plugins
4. KI-Komponente generiert Inhalte auf Anfrage
5. Generierte Inhalte werden in den Editor geladen
6. Fertige Seiten können als statisches HTML exportiert werden