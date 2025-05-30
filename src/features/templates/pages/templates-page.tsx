import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { useToast } from '../../../components/ui/toast-provider'

// Mock-Daten für Templates
interface Template {
  id: string
  name: string
  category: string
  thumbnail: string
  description: string
  popularity: number
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Business Portfolio',
    category: 'Business',
    thumbnail: 'https://via.placeholder.com/300x200/f5f5f5/333333?text=Business',
    description: 'Professionelles Template für Unternehmensportfolios mit modernem Design.',
    popularity: 4.8,
  },
  {
    id: '2',
    name: 'Creative Agency',
    category: 'Creative',
    thumbnail: 'https://via.placeholder.com/300x200/f0f0f0/333333?text=Creative',
    description: 'Dynamisches Template für Kreativagenturen mit interaktiven Elementen.',
    popularity: 4.6,
  },
  {
    id: '3',
    name: 'E-Commerce Shop',
    category: 'E-Commerce',
    thumbnail: 'https://via.placeholder.com/300x200/e8e8e8/333333?text=E-Commerce',
    description: 'Komplettes E-Commerce-Template mit Produktgalerien und Checkout-Prozess.',
    popularity: 4.9,
  },
  {
    id: '4',
    name: 'Personal Blog',
    category: 'Blog',
    thumbnail: 'https://via.placeholder.com/300x200/e0e0e0/333333?text=Blog',
    description: 'Minimalistisches Blog-Template mit Fokus auf Lesbarkeit und Inhalte.',
    popularity: 4.5,
  },
  {
    id: '5',
    name: 'Restaurant Menu',
    category: 'Food',
    thumbnail: 'https://via.placeholder.com/300x200/d8d8d8/333333?text=Restaurant',
    description: 'Elegantes Template für Restaurants mit Menükarten und Reservierungssystem.',
    popularity: 4.7,
  },
  {
    id: '6',
    name: 'Portfolio Gallery',
    category: 'Portfolio',
    thumbnail: 'https://via.placeholder.com/300x200/d0d0d0/333333?text=Portfolio',
    description: 'Visuell ansprechendes Portfolio-Template für Künstler und Designer.',
    popularity: 4.4,
  },
]

// Kategorien für Filter
const categories = [
  { value: 'all', label: 'Alle Kategorien' },
  { value: 'Business', label: 'Business' },
  { value: 'Creative', label: 'Kreativ' },
  { value: 'E-Commerce', label: 'E-Commerce' },
  { value: 'Blog', label: 'Blog' },
  { value: 'Food', label: 'Gastronomie' },
  { value: 'Portfolio', label: 'Portfolio' },
]

export default function TemplatesPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    // Simuliere API-Aufruf
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        // In einer echten Anwendung würde hier ein API-Aufruf stehen
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Verwende Mock-Daten
        setTemplates(mockTemplates)
      } catch (error) {
        toast.error('Fehler beim Laden der Templates', 'Bitte versuchen Sie es später erneut.')
        console.error('Error fetching templates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [toast])

  // Filter-Logik
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = (templateId: string) => {
    // In einer echten Anwendung würde hier ein neues Projekt mit diesem Template erstellt
    toast.success('Template ausgewählt', 'Ein neues Projekt wird erstellt...')
    
    // Simuliere Verzögerung und Navigation
    setTimeout(() => {
      navigate(`/builder/new?template=${templateId}`)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pixelmagix-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">Wählen Sie ein Template für Ihr nächstes Projekt</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Template suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Keine Templates gefunden</h2>
          <p className="text-muted-foreground mb-6">Versuchen Sie, Ihre Suchkriterien anzupassen.</p>
          <Button onClick={() => {
            setSearchQuery('')
            setSelectedCategory('all')
          }}>
            Filter zurücksetzen
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              
              <CardContent className="p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{template.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted">{template.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(template.popularity) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-1">
                      {template.popularity.toFixed(1)}
                    </span>
                  </div>
                  
                  <Button size="sm" onClick={() => handleUseTemplate(template.id)}>
                    Verwenden
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
