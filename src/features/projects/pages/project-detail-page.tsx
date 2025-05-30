import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { useToast } from '../../../components/ui/toast'

// Mock-Daten für ein Projekt
interface Project {
  id: string
  name: string
  client: string
  description: string
  status: 'draft' | 'in-progress' | 'completed'
  createdAt: string
  updatedAt: string
  thumbnail?: string
}

const mockProject: Project = {
  id: '1',
  name: 'E-Commerce Website Redesign',
  client: 'TechGadgets GmbH',
  description: 'Komplettes Redesign der E-Commerce-Plattform mit Fokus auf Benutzerfreundlichkeit und Konversionsoptimierung.',
  status: 'in-progress',
  createdAt: '2023-09-15T10:30:00Z',
  updatedAt: '2023-10-05T14:45:00Z',
  thumbnail: 'https://via.placeholder.com/800x600/f5f5f5/333333?text=TechGadgets',
}

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuliere API-Aufruf
    const fetchProject = async () => {
      try {
        setLoading(true)
        // In einer echten Anwendung würde hier ein API-Aufruf stehen
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Verwende Mock-Daten
        setProject(mockProject)
      } catch (error) {
        toast.error('Fehler beim Laden des Projekts', 'Bitte versuchen Sie es später erneut.')
        console.error('Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId, toast])

  const handleEdit = () => {
    navigate(`/builder/${projectId}`)
  }

  const handleDelete = async () => {
    try {
      // Simuliere API-Aufruf
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast.success('Projekt gelöscht', 'Das Projekt wurde erfolgreich gelöscht.')
      navigate('/projects')
    } catch (error) {
      toast.error('Fehler beim Löschen', 'Das Projekt konnte nicht gelöscht werden.')
      console.error('Error deleting project:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pixelmagix-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Projekt nicht gefunden</h2>
          <p className="text-muted-foreground mb-6">Das angeforderte Projekt existiert nicht oder wurde gelöscht.</p>
          <Button onClick={() => navigate('/projects')}>Zurück zur Projektübersicht</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">Kunde: {project.client}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/projects')}>Zurück</Button>
          <Button onClick={handleEdit}>Bearbeiten</Button>
          <Button variant="destructive" onClick={handleDelete}>Löschen</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Projektdetails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Beschreibung</h3>
                  <p>{project.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-1">Status</h3>
                    <div className="flex items-center">
                      <span className={
                        `inline-block w-2 h-2 rounded-full mr-2 ${
                          project.status === 'completed' ? 'bg-green-500' : 
                          project.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`
                      }></span>
                      <span className="capitalize">
                        {project.status === 'in-progress' ? 'In Bearbeitung' : 
                         project.status === 'completed' ? 'Abgeschlossen' : 'Entwurf'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Erstellt am</h3>
                    <p>{new Date(project.createdAt).toLocaleDateString('de-DE')}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Zuletzt aktualisiert</h3>
                    <p>{new Date(project.updatedAt).toLocaleDateString('de-DE')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Aktivitäten</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 mr-3">
                      <svg className="w-4 h-4 text-pixelmagix-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Projekt aktualisiert</p>
                      <p className="text-xs text-muted-foreground">05.10.2023, 14:45 Uhr</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 mr-3">
                      <svg className="w-4 h-4 text-pixelmagix-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Projekt erstellt</p>
                      <p className="text-xs text-muted-foreground">15.09.2023, 10:30 Uhr</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Vorschau</CardTitle>
            </CardHeader>
            <CardContent>
              {project.thumbnail ? (
                <img 
                  src={project.thumbnail} 
                  alt={project.name} 
                  className="w-full h-auto rounded-md border border-border"
                />
              ) : (
                <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Keine Vorschau verfügbar</p>
                </div>
              )}
              
              <div className="mt-4 space-y-2">
                <Button className="w-full" onClick={handleEdit}>
                  Im Visual Builder öffnen
                </Button>
                <Button variant="outline" className="w-full">
                  Vorschau anzeigen
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Aktionen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full">
                  Als PDF exportieren
                </Button>
                <Button variant="outline" className="w-full">
                  Rechnung erstellen
                </Button>
                <Button variant="outline" className="w-full">
                  Teilen
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
