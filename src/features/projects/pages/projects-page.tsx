import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, StatsCard } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { SearchInput } from '../../../components/ui/input'
import { useToast } from '../../../components/ui/toast'
import { cn, formatDate, formatRelativeTime } from '../../../lib/utils'

// Mock Data - später durch echte API-Calls ersetzen
const mockProjects = [
  {
    id: '1',
    name: 'Moderne Zahnarztpraxis Website',
    description: 'Professionelle Landingpage für Dr. Schmidt mit Terminbuchung und Praxisvorstellung',
    status: 'in-progress' as const,
    progress: 75,
    customerId: '1',
    customerName: 'Dr. Schmidt',
    customerCompany: 'Zahnarztpraxis Schmidt',
    createdAt: '2025-05-15T10:00:00Z',
    updatedAt: '2025-05-28T14:30:00Z',
    dueDate: '2025-06-15T23:59:59Z',
    template: 'Medical Professional',
    tags: ['Medizin', 'Terminbuchung', 'Responsive'],
    aiUsage: 12,
    lastExport: '2025-05-25T09:15:00Z',
  },
  {
    id: '2',
    name: 'Restaurant "Bella Vista"',
    description: 'Elegante Restaurant-Website mit Speisekarte und Reservierungssystem',
    status: 'review' as const,
    progress: 95,
    customerId: '2',
    customerName: 'Mario Rossi',
    customerCompany: 'Restaurant Bella Vista',
    createdAt: '2025-05-10T15:20:00Z',
    updatedAt: '2025-05-29T11:45:00Z',
    dueDate: '2025-06-10T23:59:59Z',
    template: 'Restaurant Deluxe',
    tags: ['Gastronomie', 'Reservierung', 'Mehrsprachig'],
    aiUsage: 8,
    lastExport: '2025-05-28T16:20:00Z',
  },
  {
    id: '3',
    name: 'Fitness Studio PowerGym',
    description: 'Motivierende Landing Page für Fitnessstudio mit Kursplan und Mitgliedschaft',
    status: 'draft' as const,
    progress: 25,
    customerId: '3',
    customerName: 'Lisa Weber',
    customerCompany: 'PowerGym GmbH',
    createdAt: '2025-05-20T09:10:00Z',
    updatedAt: '2025-05-27T13:20:00Z',
    dueDate: '2025-07-01T23:59:59Z',
    template: 'Fitness Modern',
    tags: ['Fitness', 'Kursplan', 'Mitgliedschaft'],
    aiUsage: 5,
    lastExport: null,
  },
  {
    id: '4',
    name: 'Anwaltskanzlei Meyer & Partner',
    description: 'Seriöse Website für Rechtsanwaltskanzlei mit Fachbereichen und Kontaktformular',
    status: 'completed' as const,
    progress: 100,
    customerId: '4',
    customerName: 'Dr. Meyer',
    customerCompany: 'Meyer & Partner Rechtsanwälte',
    createdAt: '2025-04-15T11:30:00Z',
    updatedAt: '2025-05-05T16:00:00Z',
    dueDate: '2025-05-15T23:59:59Z',
    template: 'Legal Professional',
    tags: ['Rechtsanwalt', 'Seriös', 'Kontaktformular'],
    aiUsage: 15,
    lastExport: '2025-05-05T16:00:00Z',
  },
  {
    id: '5',
    name: 'Startup TechFlow Solutions',
    description: 'Moderne SaaS-Landing Page mit Preistabelle und Feature-Übersicht',
    status: 'in-progress' as const,
    progress: 60,
    customerId: '5',
    customerName: 'Alex Johnson',
    customerCompany: 'TechFlow Solutions',
    createdAt: '2025-05-22T14:45:00Z',
    updatedAt: '2025-05-29T10:15:00Z', 
    dueDate: '2025-06-30T23:59:59Z',
    template: 'SaaS Modern',
    tags: ['SaaS', 'Startup', 'Preistabelle'],
    aiUsage: 20,
    lastExport: null,
  },
]

const mockStats = {
  totalProjects: mockProjects.length,
  activeProjects: mockProjects.filter(p => p.status === 'in-progress').length,
  completedProjects: mockProjects.filter(p => p.status === 'completed').length,
  avgProgress: Math.round(mockProjects.reduce((acc, p) => acc + p.progress, 0) / mockProjects.length),
}

type ProjectStatus = 'draft' | 'in-progress' | 'review' | 'completed'
type SortOption = 'name' | 'customer' | 'status' | 'progress' | 'updated' | 'due'
type FilterOption = 'all' | ProjectStatus

const statusConfig = {
  draft: {
    label: 'Entwurf',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    icon: '📝',
  },
  'in-progress': {
    label: 'In Bearbeitung',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    icon: '⚙️',
  },
  review: {
    label: 'Review',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    icon: '👀',
  },
  completed: {
    label: 'Abgeschlossen',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    icon: '✅',
  },
}

const Icons = {
  plus: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  filter: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
    </svg>
  ),
  sort: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
  ),
  calendar: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  user: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  eye: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  download: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  more: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  ),
}

export default function ProjectsPage() {
  const navigate = useNavigate()
  const { success, info, error } = useToast()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterOption>('all')
  const [sortBy, setSortBy] = useState<SortOption>('updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Gefilterte und sortierte Projekte
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = mockProjects

    // Suche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.customerName.toLowerCase().includes(query) ||
        project.customerCompany.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Status-Filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(project => project.status === filterStatus)
    }

    // Sortierung
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'customer':
          aValue = a.customerName.toLowerCase()
          bValue = b.customerName.toLowerCase()
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'progress':
          aValue = a.progress
          bValue = b.progress
          break
        case 'updated':
          aValue = new Date(a.updatedAt).getTime()
          bValue = new Date(b.updatedAt).getTime()
          break
        case 'due':
          aValue = new Date(a.dueDate).getTime()
          bValue = new Date(b.dueDate).getTime()
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [searchQuery, filterStatus, sortBy, sortOrder])

  const handleNewProject = () => {
    info('Neues Projekt', 'Weiterleitung zur Projekterstellung...')
    // Hier würde normalerweise Navigation zur Projekterstellung stattfinden
    // navigate('/projects/new')
  }

  const handleProjectAction = (action: string, projectId: string, projectName: string) => {
    switch (action) {
      case 'edit':
        navigate(`/projects/${projectId}`)
        break
      case 'builder':
        navigate(`/builder/${projectId}`)
        break
      case 'preview':
        info(`Vorschau für "${projectName}"`, 'Öffnet Projekt-Vorschau...')
        break
      case 'export':
        success(`Export von "${projectName}"`, 'ZIP-Datei wird erstellt...')
        break
      case 'duplicate':
        success(`Projekt "${projectName}"`, 'Erfolgreich dupliziert')
        break
      case 'delete':
        error(`Projekt "${projectName}"`, 'Löschung bestätigt')
        break
      default:
        break
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500'
    if (progress >= 70) return 'bg-blue-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && dueDate !== null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projekte</h1>
          <p className="text-muted-foreground mt-1">
            Verwalten Sie alle Ihre Landingpage-Projekte an einem Ort
          </p>
        </div>
        
        <Button 
          variant="pixelmagix" 
          leftIcon={Icons.plus}
          onClick={handleNewProject}
        >
          Neues Projekt
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Gesamt"
          value={mockStats.totalProjects}
          description="Alle Projekte"
        />
        
        <StatsCard
          title="Aktiv"
          value={mockStats.activeProjects}
          description="In Bearbeitung"
        />
        
        <StatsCard
          title="Abgeschlossen"
          value={mockStats.completedProjects}
          description="Erfolgreich ausgeliefert"
        />
        
        <StatsCard
          title="Ø Fortschritt"
          value={`${mockStats.avgProgress}%`}
          description="Durchschnittlicher Fortschritt"
        />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <SearchInput
            placeholder="Projekte suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:w-80"
          />
          
          <div className="flex gap-2">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterOption)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Alle Status</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {config.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field as SortOption)
                setSortOrder(order as 'asc' | 'desc')
              }}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="updated-desc">Zuletzt bearbeitet</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="customer-asc">Kunde A-Z</option>
              <option value="progress-desc">Fortschritt ↓</option>
              <option value="progress-asc">Fortschritt ↑</option>
              <option value="due-asc">Fälligkeitsdatum ↑</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex border border-input rounded-md p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'px-3 py-1 rounded text-sm transition-colors',
              viewMode === 'grid' 
                ? 'bg-pixelmagix-600 text-white' 
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'px-3 py-1 rounded text-sm transition-colors',
              viewMode === 'list' 
                ? 'bg-pixelmagix-600 text-white' 
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Liste
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {filteredAndSortedProjects.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">Keine Projekte gefunden</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || filterStatus !== 'all' 
              ? 'Versuchen Sie andere Suchbegriffe oder Filter.'
              : 'Erstellen Sie Ihr erstes Projekt, um loszulegen.'
            }
          </p>
          {!searchQuery && filterStatus === 'all' && (
            <Button variant="pixelmagix" onClick={handleNewProject}>
              Erstes Projekt erstellen
            </Button>
          )}
        </Card>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        )}>
          {filteredAndSortedProjects.map((project) => (
            <Card 
              key={project.id} 
              className={cn(
                'project-card hover-lift',
                viewMode === 'list' && 'flex items-center p-4'
              )}
              hover="border"
            >
              <CardHeader className={cn(viewMode === 'list' && 'flex-1 py-0')}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 hover:text-pixelmagix-600 transition-colors">
                      <Link to={`/projects/${project.id}`}>
                        {project.name}
                      </Link>
                    </CardTitle>
                    
                    {viewMode === 'grid' && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        statusConfig[project.status].color
                      )}>
                        <span className="mr-1">{statusConfig[project.status].icon}</span>
                        {statusConfig[project.status].label}
                      </span>
                      
                      {isOverdue(project.dueDate) && project.status !== 'completed' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                          ⚠️ Überfällig
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Icons.user />
                      <span className="ml-1">{project.customerName}</span>
                      <span className="mx-2">•</span>
                      <Icons.calendar />
                      <span className="ml-1">Fällig: {formatDate(project.dueDate)}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Fortschritt</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={cn(
                            'h-2 rounded-full transition-all',
                            getProgressColor(project.progress)
                          )}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    {viewMode === 'grid' && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Zuletzt bearbeitet {formatRelativeTime(project.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className={cn(
                'pt-0',
                viewMode === 'list' && 'flex items-center gap-4 py-0'
              )}>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={Icons.edit}
                    onClick={() => handleProjectAction('edit', project.id, project.name)}
                  >
                    Bearbeiten
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="pixelmagix"
                    leftIcon={Icons.eye}
                    onClick={() => handleProjectAction('builder', project.id, project.name)}
                  >
                    Builder
                  </Button>

                  {/* Actions Dropdown würde hier implementiert werden */}
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={Icons.more}
                    onClick={() => {
                      // Dropdown-Menü würde hier geöffnet werden
                      info('Aktionen', `Weitere Optionen für "${project.name}"`)
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination würde hier implementiert werden */}
      {filteredAndSortedProjects.length > 0 && (
        <div className="flex justify-center mt-8">
          <p className="text-sm text-muted-foreground">
            {filteredAndSortedProjects.length} von {mockProjects.length} Projekten
          </p>
        </div>
      )}
    </div>
  )
}
