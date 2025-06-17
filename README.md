## 🎯 Überblick

Pixelmagix ist eine lokal laufende, KI-gestützte Software zur professionellen Erstellung von Landingpages. Die Software richtet sich an Agenturen und Freelancer, die für ihre Kunden hochwertige Landingpages erstellen und als fertiges ZIP-Paket ausliefern möchten.

### ✨ Hauptfeatures

- 🏢 **Kundenverwaltung** - Vollständige CRM-Integration
- 🎨 **Visual Builder** - Drag & Drop Interface mit Live-Vorschau
- 🤖 **KI-Integration** - OpenAI, Claude & Ollama Support
- 📱 **Responsive Design** - Automatische Geräte-Optimierung
- 📦 **ZIP-Export** - Fertige HTML/CSS/JS Pakete
- 🎭 **Template-System** - Wiederverwendbare Layouts
- 💰 **Rechnungsstellung** - Integrierte Abrechnung
- 🔒 **Lokale Datenbank** - Vollständiger Datenschutz

## 🚀 Schnellstart

1. Python-Abhängigkeiten installieren:
   ```bash
   pip install -r requirements.txt
   ```
2. Datenbank initialisieren und Testkunden anlegen:
   ```bash
   python -m pixelmagix init
   python -m pixelmagix addcustomer "Max Mustermann" max@example.com
   ```
3. Landingpage bauen und exportieren:
   ```bash
   python -m pixelmagix build "Mein Projekt" output/index.html
   python -m pixelmagix export output site.zip
   ```

### 🖥️ GUI starten

Eine einfache grafische Oberfläche lässt sich mit folgendem Befehl öffnen:

```bash
python -m pixelmagix.gui
```

Alternativ kann auch das Skript `start_gui.py` verwendet werden, das zuvor die
benötigten Abhängigkeiten installiert und anschließend die Oberfläche startet:

```bash
python start_gui.py
```

Die Oberfläche bietet Buttons zum Initialisieren der Datenbank, Anlegen von
Kunden sowie zum Bauen und Exportieren von Landingpages.


## ⚙️ Codex-Umgebung

Um Pixelmagix in Codex auszufuehren, lege eine Datei `codex.yaml` im Projektwurzelverzeichnis an:

```yaml
setup:
  - pip install -r requirements.txt
test: pytest
```

Lade anschliessend das Repository in Codex, um die Abhaengigkeiten automatisch zu installieren und die Tests auszufuehren.



## 📦 Export-Funktionen

### ZIP-Export Features
- **Minifiziertes HTML/CSS/JS**
- **SEO-Optimierung** (Meta-Tags, Strukturierte Daten)
- **Performance-Optimierung** (Asset-Compression)
- **Responsive Bilder**
- **Security Headers**

### Export-Formate
- `.zip` - Komplette Website
- `.html` - Einzelne HTML-Datei  
- `.pdf` - Design-Vorschau (geplant)

## 🎯 Roadmap

### Phase 1 (MVP) ✅
- [x] Basis-Kundenverwaltung
- [x] Einfacher Visual Builder
- [x] Grundlegendes Branding-System
- [x] ZIP-Export
- [x] Responsive Vorschau
- [x] Erste KI-Integration

### Phase 2 (Q2 2025)
- [ ] Erweiterte Template-Bibliothek
- [ ] A/B Testing Features
- [ ] Analytics Integration
- [ ] Multi-Language Support
- [ ] Advanced KI-Features

### Phase 3 (Q3 2025)
- [ ] Plugin-System
- [ ] Team-Collaboration
- [ ] White-Label Solution
- [ ] API für Externe Integration

## 🤝 Contributing

1. Fork das Repository
2. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## 📝 License

Dieses Projekt ist unter der MIT License lizensiert - siehe [LICENSE](LICENSE) für Details.

## 💬 Support

Bei Fragen oder Problemen:
- 📧 Email: support@pixelmagix.dev
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/pixelmagix/issues)
- 📚 Docs: [Documentation](https://docs.pixelmagix.dev)

---

**Erstellt mit ❤️ für Agenturen und Freelancer**