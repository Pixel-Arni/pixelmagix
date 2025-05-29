import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toaster'

// Types für den Visual Builder
interface Section {
  id: string
  type: 'hero' | 'features' | 'about' | 'contact' | 'cta' | 'testimonials' | 'pricing'
  name: string
  content: Record<string, any>
  styles: Record<string, any>
  order: number
}

interface Project {
  id: string
  name: string
  sections: Section[]
  settings: {
    theme: 'light' | 'dark'
    primaryColor: string
    font: string
    favicon?: string
  }
}

// Mock Data - später durch echte API-Calls ersetzen
const mockProject: Project = {
  id: '1',
  name: 'Beispiel Landingpage',
  sections: [
    {
      id: 'hero-1',
      type: 'hero',
      name: 'Hero Section',
      content: {
        headline: 'Willkommen bei unserem Service',
        subheadline: 'Die beste Lösung für Ihr Unternehmen',
        ctaText: 'Jetzt starten',
        backgroundImage: '',
      },
      styles: {
        backgroundColor: '#0ea5e9',
        textColor: '#ffffff',
        padding: '80px 0',
      },
      order: 0,
    },
    {
      id: 'features-1',
      type: 'features',
      name: 'Features Section',
      content: {
        headline: 'Unsere Features',
        features: [
          { title: 'Schnell', description: 'Blitzschnelle Ladezeiten', icon: '⚡' },
          { title: 'Sicher', description: 'Höchste Sicherheitsstandards', icon: '🔒' },
          { title: 'Zuverlässig', description: '99.9% Uptime Garantie', icon: '✅' },
        ],
      },
      styles: {
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        padding: '60px 0',
      },
      order: 1,
    },
  ],
  settings: {
    theme: 'light',
    primaryColor: '#0ea5e9',
    font: 'Inter',
  },
}

// Verfügbare Section-Templates
const sectionTemplates = [
  {
    type: 'hero',
    name: 'Hero Section',
    icon: '🏠',
    description: 'Hauptbereich mit Überschrift und Call-to-Action',
  },
  {
    type: 'features',
    name: 'Features',
    icon: '⭐',
    description: 'Darstellung von Produktfeatures',
  },
  {
    type: 'about',
    name: 'Über uns',
    icon: '👥',
    description: 'Informationen über das Unternehmen',
  },
  {
    type: 'testimonials',
    name: 'Testimonials',
    icon: '💬',
    description: 'Kundenbewertungen und -stimmen',
  },
  {
    type: 'pricing',
    name: 'Preise',
    icon: '💰',
    description: 'Preistabellen und Pakete',
  },
  {
    type: 'contact',
    name: 'Kontakt',
    icon: '📧',
    description: 'Kontaktformular und Informationen',
  },
  {
    type: 'cta',
    name: 'Call-to-Action',
    icon: '🎯',
    description: 'Handlungsaufforderung',
  },
]

// Icons
const Icons = {
  save: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  preview: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  export: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  back: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  delete: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  plus: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  drag: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
    </svg>
  ),
  ai: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
}

export default function VisualBuilderPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { success, error, info } = useToast()

  // State Management
  const [project, setProject] = useState<Project>(mockProject)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const [sidebarTab, setSidebarTab] = useState<'sections' | 'properties' | 'ai'>('sections')

  // Load Project Data
  useEffect(() => {
    if (projectId) {
      // Hier würde normalerweise ein API-Call zum Laden des Projekts stattfinden
      console.log('Loading project:', projectId)
      // setProject(loadedProject)
    }
  }, [projectId])

  // Handlers
  const handleBack = () => {
    navigate('/projects')
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Hier würde normalerweise ein API-Call zum Speichern stattfinden
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      success('Projekt gespeichert', 'Alle Änderungen wurden erfolgreich gespeichert.')
    } catch (err) {
      error('Fehler beim Speichern', 'Das Projekt konnte nicht gespeichert werden.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode)
    setSelectedSection(null)
    info(
      isPreviewMode ? 'Bearbeitungsmodus' : 'Vorschaumodus',
      isPreviewMode ? 'Sie können jetzt wieder bearbeiten.' : 'Sehen Sie, wie Ihre Seite aussieht.'
    )
  }

  const handleExport = async () => {
    try {
      info('Export wird vorbereitet', 'Ihre Landingpage wird als ZIP-Datei generiert...')
      // Hier würde normalerweise die Export-Logik stattfinden
      await new Promise(resolve => setTimeout(resolve, 2000))
      success('Export erfolgreich', 'Ihre Landingpage wurde erfolgreich exportiert.')
    } catch (err) {
      error('Export fehlgeschlagen', 'Die Landingpage konnte nicht exportiert werden.')
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDragId(null)

    if (!over || active.id === over.id) return

    setProject(prev => {
      const sections = [...prev.sections]
      const activeIndex = sections.findIndex(s => s.id === active.id)
      const overIndex = sections.findIndex(s => s.id === over.id)

      if (activeIndex !== -1 && overIndex !== -1) {
        const [movedSection] = sections.splice(activeIndex, 1)
        sections.splice(overIndex, 0, movedSection)
        
        // Update order
        sections.forEach((section, index) => {
          section.order = index
        })
      }

      return { ...prev, sections }
    })
  }

  const handleAddSection = (type: Section['type']) => {
    const newSection: Section = {
      id: `${type}-${Date.now()}`,
      type,
      name: `Neue ${type} Section`,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      order: project.sections.length,
    }

    setProject(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }))

    setSelectedSection(newSection)
    setSidebarTab('properties')
    success('Section hinzugefügt', `Eine neue ${type} Section wurde hinzugefügt.`)
  }

  const handleDeleteSection = (sectionId: string) => {
    setProject(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId),
    }))
    
    if (selectedSection?.id === sectionId) {
      setSelectedSection(null)
    }
    
    success('Section gelöscht', 'Die Section wurde erfolgreich entfernt.')
  }

  const handleSectionClick = (section: Section) => {
    if (!isPreviewMode) {
      setSelectedSection(section)
      setSidebarTab('properties')
    }
  }

  const handleAIAssist = async () => {
    try {
      info('KI-Assistent', 'Generiere Verbesserungsvorschläge...')
      // Hier würde normalerweise die KI-Integration stattfinden
      await new Promise(resolve => setTimeout(resolve, 2000))
      success('KI-Vorschläge', 'Neue Verbesserungsvorschläge wurden generiert.')
      setSidebarTab('ai')
    } catch (err) {
      error('KI-Fehler', 'Die KI-Unterstützung ist momentan nicht verfügbar.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              {Icons.back}
              <span className="ml-2">Zurück</span>
            </Button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {project.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Visual Builder
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAIAssist}
              className="hidden sm:flex"
            >
              {Icons.ai}
              <span className="ml-2">KI-Assistent</span>
            </Button>
            
            <Button
              variant={isPreviewMode ? 'default' : 'outline'}
              size="sm"
              onClick={handlePreview}
            >
              {Icons.preview}
              <span className="ml-2 hidden sm:inline">
                {isPreviewMode ? 'Bearbeiten' : 'Vorschau'}
              </span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="hidden sm:flex"
            >
              {Icons.export}
              <span className="ml-2">Exportieren</span>
            </Button>

            <Button
              variant="pixelmagix"
              size="sm"
              onClick={handleSave}
              loading={isSaving}
            >
              {Icons.save}
              <span className="ml-2">Speichern</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Canvas Area */}
        <div className="flex-1 overflow-auto">
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="builder-canvas">
              {/* Mobile Device Frame für Preview */}
              <div className={cn(
                'mx-auto bg-white dark:bg-gray-800 shadow-xl',
                isPreviewMode 
                  ? 'max-w-sm border-8 border-gray-800 rounded-3xl mt-8 mb-8' 
                  : 'max-w-5xl border border-gray-200 dark:border-gray-700 mt-8 mb-8'
              )}>
                <SortableContext 
                  items={project.sections.map(s => s.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  {project.sections
                    .sort((a, b) => a.order - b.order)
                    .map(section => (
                      <SectionRenderer
                        key={section.id}
                        section={section}
                        isSelected={selectedSection?.id === section.id}
                        isPreviewMode={isPreviewMode}
                        onClick={() => handleSectionClick(section)}
                        onDelete={() => handleDeleteSection(section.id)}
                      />
                    ))}
                </SortableContext>
              </div>
            </div>

            <DragOverlay>
              {activeDragId ? (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium">
                    {project.sections.find(s => s.id === activeDragId)?.name}
                  </p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Right Sidebar */}
        {!isPreviewMode && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {(['sections', 'properties', 'ai'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setSidebarTab(tab)}
                  className={cn(
                    'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                    sidebarTab === tab
                      ? 'bg-pixelmagix-50 text-pixelmagix-600 border-b-2 border-pixelmagix-500 dark:bg-pixelmagix-950 dark:text-pixelmagix-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  )}
                >
                  {tab === 'sections' && 'Sections'}
                  {tab === 'properties' && 'Eigenschaften'}
                  {tab === 'ai' && 'KI'}
                </button>
              ))}
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {sidebarTab === 'sections' && (
                <SectionsPanel 
                  templates={sectionTemplates}
                  onAddSection={handleAddSection}
                />
              )}
              
              {sidebarTab === 'properties' && (
                <PropertiesPanel 
                  section={selectedSection}
                  onChange={(updatedSection) => {
                    setProject(prev => ({
                      ...prev,
                      sections: prev.sections.map(s => 
                        s.id === updatedSection.id ? updatedSection : s
                      ),
                    }))
                    setSelectedSection(updatedSection)
                  }}
                />
              )}

              {sidebarTab === 'ai' && (
                <AIPanel />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper Functions
function getDefaultContent(type: Section['type']): Record<string, any> {
  switch (type) {
    case 'hero':
      return {
        headline: 'Your Headline Here',
        subheadline: 'Your subheadline goes here',
        ctaText: 'Call to Action',
        backgroundImage: '',
      }
    case 'features':
      return {
        headline: 'Our Features',
        features: [
          { title: 'Feature 1', description: 'Description', icon: '⭐' },
          { title: 'Feature 2', description: 'Description', icon: '🚀' },
          { title: 'Feature 3', description: 'Description', icon: '💡' },
        ],
      }
    case 'about':
      return {
        headline: 'About Us',
        content: 'Tell your story here...',
        image: '',
      }
    case 'contact':
      return {
        headline: 'Contact Us',
        email: 'contact@example.com',
        phone: '+49 123 456789',
        address: 'Your Address',
      }
    case 'cta':
      return {
        headline: 'Ready to get started?',
        ctaText: 'Get Started',
        backgroundColor: '#0ea5e9',
      }
    case 'testimonials':
      return {
        headline: 'What our customers say',
        testimonials: [
          { name: 'John Doe', text: 'Great service!', company: 'Company A' },
        ],
      }
    case 'pricing':
      return {
        headline: 'Choose your plan',
        plans: [
          { name: 'Basic', price: '€9.99', features: ['Feature 1', 'Feature 2'] },
        ],
      }
    default:
      return {}
  }
}

function getDefaultStyles(type: Section['type']): Record<string, any> {
  const baseStyles = {
    padding: '60px 0',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
  }

  switch (type) {
    case 'hero':
      return {
        ...baseStyles,
        padding: '80px 0',
        backgroundColor: '#0ea5e9',
        textColor: '#ffffff',
      }
    case 'cta':
      return {
        ...baseStyles,
        backgroundColor: '#0ea5e9',
        textColor: '#ffffff',
      }
    default:
      return baseStyles
  }
}

import { SectionRenderer, SectionsPanel, PropertiesPanel, AIPanel } from '../components/section-components'