# 🎨 Pixelmagix

> KI-gestützte Software zur professionellen Erstellung von Landingpages für Agenturen und Freelancer

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white)](https://prisma.io/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

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

## 🏗️ Technologie-Stack

### Frontend
- **React 18+** mit TypeScript
- **shadcn/ui** (Tailwind CSS basiert)
- **@dnd-kit** für Drag & Drop
- **Zustand** für State Management
- **TanStack Query** für Server State

### Backend & Database
- **SQLite** mit Prisma ORM
- **Vite** als Build Tool
- **Webstudio.dev** Integration für Visual Editor

### KI-Integration
- **OpenAI API** (GPT-4, GPT-3.5)
- **Claude API** (Claude-3)
- **Ollama** (Llama 3.1, Mistral - kostenlos & lokal)

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js 18+ 
- npm/yarn/pnpm
- Optional: Ollama für lokale KI

### 1. Repository klonen
```bash
git clone https://github.com/yourusername/pixelmagix.git
cd pixelmagix
```

### 2. Dependencies installieren
```bash
npm install
# oder
yarn install
# oder
pnpm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

Bearbeite `.env.local`:
```env
# Datenbank
DATABASE_URL="file:./dev.db"

# KI APIs (optional)
OPENAI_API_KEY="sk-..."
CLAUDE_API_KEY="sk-ant-..."

# Ollama (lokal)
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.1"
```

### 4. Datenbank Setup
```bash
npm run db:generate
npm run db:migrate
```

### 5. Development Server starten
```bash
npm run dev
```

Die Anwendung läuft auf `http://localhost:3000`

## 📁 Projektstruktur

```
pixelmagix/
├── 📁 src/
│   ├── 📁 components/        # UI-Komponenten
│   │   ├── 📁 layout/        # Layout-Komponenten
│   │   ├── 📁 providers/     # Kontext Provider
│   │   └── 📁 ui/            # shadcn/ui Basis
│   ├── 📁 features/         # Feature-Module
│   │   ├── 📁 customers/     # Kundenverwaltung
│   │   ├── 📁 dashboard/     # Dashboard
│   │   ├── 📁 invoices/      # Rechnungsverwaltung
│   │   ├── 📁 projects/      # Projektmanagement
│   │   ├── 📁 settings/      # Nutzer-Einstellungen
│   │   ├── 📁 templates/     # Landingpage-Templates
│   │   └── 📁 visual-builder/ # Visual Editor
│   ├── 📁 lib/               # Utilities
│   └── 📁 styles/            # Globale Styles
├── 📁 prisma/               # Datenbank-Schema
```

## 🎨 Entwicklung

### Available Scripts

```bash
# Development
npm run dev              # Development Server
npm run build           # Production Build
npm run preview         # Build Vorschau

# Database
npm run db:generate     # Prisma Client generieren
npm run db:migrate      # Database Migration
npm run db:studio       # Prisma Studio (GUI)

# Code Quality
npm run lint            # ESLint
npm run test            # Tests ausführen
npm run test:ui         # Test UI
```

### Code Style
- **ESLint** für Code-Qualität
- **TypeScript Strict Mode**
- **Prettier** Integration
- **Import Aliases** (`@/components`, `@/lib`, etc.)

## 🤖 KI-Integration

### Unterstützte Provider

#### OpenAI
```typescript
// Automatische Integration
const response = await generateLayout({
  provider: 'openai',
  model: 'gpt-4',
  content: userContent
})
```

#### Claude
```typescript
const response = await generateLayout({
  provider: 'claude',  
  model: 'claude-3-sonnet',
  content: userContent
})
```

#### Ollama (Lokal)
```bash
# Ollama installieren und Modell laden
ollama pull llama3.1
ollama serve
```

```typescript
const response = await generateLayout({
  provider: 'ollama',
  model: 'llama3.1', 
  content: userContent
})
```

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