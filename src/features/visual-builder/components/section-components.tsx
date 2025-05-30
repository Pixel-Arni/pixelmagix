import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '../../../lib/utils'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

// Types
interface Section {
  id: string
  type: 'hero' | 'features' | 'about' | 'contact' | 'cta' | 'testimonials' | 'pricing'
  name: string
  content: Record<string, any>
  styles: Record<string, any>
  order: number
}

// Icons
const Icons = {
  drag: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
    </svg>
  ),
  delete: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
}

// SectionRenderer Component
interface SectionRendererProps {
  section: Section
  isSelected: boolean
  isPreviewMode: boolean
  onClick: () => void
  onDelete: () => void
}

export function SectionRenderer({ section, isSelected, isPreviewMode, onClick, onDelete }: SectionRendererProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
    disabled: isPreviewMode,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: section.styles.backgroundColor,
    color: section.styles.textColor,
    padding: section.styles.padding,
    opacity: isDragging ? 0.5 : 1,
  }

  // Render different section types
  const renderSectionContent = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-6">
                {section.content.headline}
              </h1>
              {section.content.subheadline && (
                <p className="text-xl mb-8 opacity-90">
                  {section.content.subheadline}
                </p>
              )}
              {section.content.ctaText && (
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                >
                  {section.content.ctaText}
                </Button>
              )}
            </div>
          </div>
        )
      
      case 'features':
        return (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {section.content.headline}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {section.content.features.map((feature: any, index: number) => (
                <div key={index} className="text-center p-6 rounded-lg bg-white bg-opacity-10">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="opacity-80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'about':
        return (
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6">{section.content.headline}</h2>
                <div className="prose dark:prose-invert">
                  <p>{section.content.content}</p>
                </div>
              </div>
              {section.content.image && (
                <div className="flex-1">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Bild</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'contact':
        return (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{section.content.headline}</h2>
            </div>
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input disabled={isPreviewMode} placeholder="Ihr Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">E-Mail</label>
                  <Input disabled={isPreviewMode} placeholder="ihre-email@beispiel.de" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nachricht</label>
                  <textarea 
                    disabled={isPreviewMode}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm"
                    rows={4}
                    placeholder="Ihre Nachricht"
                  />
                </div>
                <Button disabled={isPreviewMode}>Senden</Button>
              </div>
            </div>
          </div>
        )
      
      case 'cta':
        return (
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold mb-6">{section.content.headline}</h2>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
            >
              {section.content.ctaText}
            </Button>
          </div>
        )
      
      case 'testimonials':
        return (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{section.content.headline}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.content.testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="bg-white dark:bg-gray-800 bg-opacity-10 p-6 rounded-lg">
                  <p className="mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm opacity-70">{testimonial.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'pricing':
        return (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{section.content.headline}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {section.content.plans.map((plan: any, index: number) => (
                <div key={index} className="bg-white dark:bg-gray-800 bg-opacity-10 p-6 rounded-lg text-center">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold my-4">{plan.price}</div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature: string, i: number) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                  <Button className="w-full">{plan.ctaText}</Button>
                </div>
              ))}
            </div>
          </div>
        )
      
      default:
        return (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                {section.content.headline || section.name}
              </h2>
              {section.content.subheadline && (
                <p className="text-lg opacity-90">
                  {section.content.subheadline}
                </p>
              )}
            </div>
          </div>
        )
    }
  }

  return (
    <div 
      ref={setNodeRef}
      {...attributes}
      className={cn(
        'relative group cursor-pointer transition-all',
        isSelected && !isPreviewMode && 'ring-2 ring-pixelmagix-500 ring-offset-2',
        !isPreviewMode && 'hover:ring-1 hover:ring-gray-300'
      )}
      onClick={onClick}
      style={style}
    >
      {!isPreviewMode && (
        <>
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move" {...listeners}>
            {Icons.drag}
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              {Icons.delete}
            </Button>
          </div>
        </>
      )}
      
      {renderSectionContent()}
    </div>
  )
}

// SectionsPanel Component
interface SectionsPanelProps {
  templates: Array<{
    type: string
    name: string
    description: string
    icon: React.ReactNode
  }>
  onAddSection: (type: string) => void
}

export function SectionsPanel({ templates, onAddSection }: SectionsPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">Sections hinzufügen</h3>
        <div className="grid grid-cols-1 gap-2">
          {templates.map((template) => (
            <button
              key={template.type}
              onClick={() => onAddSection(template.type)}
              className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-2xl mr-3">{template.icon}</span>
              <div>
                <p className="font-medium text-sm">{template.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {template.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// PropertiesPanel Component
interface PropertiesPanelProps {
  section: Section | null
  onChange: (updatedSection: Section) => void
}

export function PropertiesPanel({ section, onChange }: PropertiesPanelProps) {
  if (!section) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Wählen Sie eine Section aus, um ihre Eigenschaften zu bearbeiten.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Section bearbeiten</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {section.name}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Section Name
          </label>
          <Input
            value={section.name}
            onChange={(e) => onChange({ ...section, name: e.target.value })}
          />
        </div>

        {section.content.headline && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Überschrift
            </label>
            <Input
              value={section.content.headline}
              onChange={(e) => onChange({ 
                ...section, 
                content: { ...section.content, headline: e.target.value }
              })}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Hintergrundfarbe
          </label>
          <Input
            type="color"
            value={section.styles.backgroundColor}
            onChange={(e) => onChange({ 
              ...section, 
              styles: { ...section.styles, backgroundColor: e.target.value }
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Textfarbe
          </label>
          <Input
            type="color"
            value={section.styles.textColor}
            onChange={(e) => onChange({ 
              ...section, 
              styles: { ...section.styles, textColor: e.target.value }
            })}
          />
        </div>
      </div>
    </div>
  )
}

// AIPanel Component
export function AIPanel() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">KI-Assistent</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Lassen Sie sich von der KI bei der Gestaltung helfen.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Layout-Vorschläge</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Keine neuen Vorschläge verfügbar.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
