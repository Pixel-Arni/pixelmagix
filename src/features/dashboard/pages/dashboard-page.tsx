import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, StatsCard, FeatureCard } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { SearchInput } from '../../../components/ui/input'
import { useToast } from '../../../components/ui/toast'

// Mock Data - später durch echte API-Calls ersetzen
const mockStats = {
  totalCustomers: 24,
  activeProjects: 12,
  completedProjects: 45,
  totalRevenue: 12750,
  monthlyGrowth: 8.2,
  aiUsage: 234,
  weeklyStats: [
    { week: 'KW 18', projects: 3, revenue: 2400 },
    { week: 'KW 19', projects: 5, revenue: 3200 },
    { week: 'KW 20', projects: 4, revenue: 2800 },
    { week: 'KW 21', projects: 7, revenue: 4100 },
    { week: 'KW 22', projects: 6, revenue: 3500 },
  ],
}

const mockRecentProjects = [
  {
    id: '1',
    name: 'Moderne Zahnarztpraxis',
    customer: 'Dr. Schmidt',
    status: 'in-progress',
    progress: 75,
    dueDate: '2025-06-15',
    lastUpdate: '2025-05-28',
    priority: 'high',
  },
  {
    id: '2',
    name: 'Restaurant "Bella Vista"',
    customer: 'Mario Rossi',
    status: 'review',
    progress: 95,
    dueDate: '2025-06-10',
    lastUpdate: '2025-05-29',
    priority: 'medium',
  },
  {
    id: '3',
    name: 'Fitness Studio Launch',
    customer: 'PowerGym GmbH',
    status: 'draft',
    progress: 25,
    dueDate: '2025-07-01',
    lastUpdate: '2025-05-27',
    priority: 'low',
  },
  {
    id: '4',
    name: 'Anwaltskanzlei Webseite',
    customer: 'Meyer & Partner',
    status: 'completed',
    progress: 100,
    dueDate: '2025-05-20',
    lastUpdate: '2025-05-20',
    priority: 'high',
  },
]

const mockRecentCustomers = [
  {
    id: '1',
    name: 'Dr. Schmidt',
    company: 'Zahnarztpraxis Schmidt',
    email: 'schmidt@praxis.de',
    projects: 2,
    lastContact: '2025-05-28',
    status: 'active',
  },
  {
    id: '2',
    name: 'Mario Rossi',
    company: 'Restaurant Bella Vista',
    email: 'mario@bellavista.de',
    projects: 1,
    lastContact: '2025-05-29',
    status: 'active',
  },
  {
    id: '3',
    name: 'Lisa Weber',
    company: 'PowerGym GmbH',
    email: 'lisa@powergym.de',
    projects: 3,
    lastContact: '2025-05-27',
    status: 'new',
  },
]

const mockActivities = [
  {
    id: '1',
    type: 'project_updated',
    title: 'Projekt "Zahnarztpraxis" aktualisiert',
    description: 'Hero-Section überarbeitet',
    timestamp: '2025-05-29T14:30:00Z',
    user: 'Sie',
    status: 'success',
  },
  {
    id: '2',
    type: 'customer_created',
    title: 'Neuer Kunde hinzugefügt',
    description: 'PowerGym GmbH wurde als Kunde erfasst',
    timestamp: '2025-05-29T10:15:00Z',
    user: 'Sie',
    status: 'info',
  },
  {
    id: '3',
    type: 'project_exported',
    title: 'Projekt exportiert',
    description: 'Restaurant Bella Vista - ZIP-Export erfolgreich',
    timestamp: '2025-05-28T16:45:00Z',
    user: 'Sie',
    status: 'success',
  },
  {
    id: '4',
    type: 'ai_suggestion',
    title: 'KI-Vorschlag generiert',
    description: 'Neue Layout-Optimierung für Hero-Section vorgeschlagen',
    timestamp: '2025-05-28T09:20:00Z',
    user: 'KI-Assistent',
    status: 'ai',
  },
  {
    id: '5',
    type: 'invoice_paid',
    title: 'Rechnung bezahlt',
    description: 'INV-2025-001 - €2.500 erhalten',
    timestamp: '2025-05-27T11:30:00Z',
    user: 'System',
    status: 'success',
  },
]

const mockUpcomingTasks = [
  {
    id: '1',
    title: 'Zahnarztpraxis Review',
    description: 'Finales Review mit Dr. Schmidt',
    dueDate: '2025-05-30T14:00:00Z',
    priority: 'high',
    project: 'Moderne Zahnarztpraxis',
  },
  {
    id: '2',
    title: 'Rechnung erstellen',
    description: 'Rechnung für Restaurant Bella Vista',
    dueDate: '2025-05-31T10:00:00Z',
    priority: 'medium',
    project: 'Restaurant "Bella Vista"',
  },
  {
    id: '3',
    title: 'Template-Update',
    description: 'Fitness-Template mit neuen Features erweitern',
    dueDate: '2025-06-02T09:00:00Z',
    priority: 'low',
    project: null,
  },
]

// Icons
const Icons = {
  users: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  projects: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  completed: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  revenue: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ),
  ai: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  plus: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  arrow: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  clock: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  chart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  template: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  bell: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  star: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
}

function getStatusColor(status: string) {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'review':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'draft':
      return 'Entwurf'
    case 'in-progress':
      return 'In Bearbeitung'
    case 'review':
      return 'Review'
    case 'completed':
      return 'Abgeschlossen'
    default:
      return status
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

function getPriorityLabel(priority: string) {
  switch (priority) {
    case 'high':
      return 'Hoch'
    case 'medium':
      return 'Mittel'
    case 'low':
      return 'Niedrig'
    default:
      return priority
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'project_updated':
      return <div className="text-blue-600">{Icons.projects}</div>
    case 'customer_created':
      return <div className="text-green-600">{Icons.users}</div>
    case 'project_exported':
      return <div className="text-purple-600">{Icons.completed}</div>
    case 'ai_suggestion':
      return <div className="text-pixelmagix-600">{Icons.ai}</div>
    case 'invoice_paid':
      return <div className="text-green-600">{Icons.revenue}</div>
    default:
      return <div className="text-gray-600">{Icons.info}</div>
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatRelativeTime(dateString: string) {
  const now = new Date()
  const date = new Date(dateString)
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Gerade eben'
  if (diffInHours < 24) return `vor ${diffInHours} Stunde${diffInHours !== 1 ? 'n' : ''}`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `vor ${diffInDays} Tag${diffInDays !== 1 ? 'en' : ''}`
  
  return formatDate(dateString)
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const { success, info } = useToast()

  useEffect(() => {
    // Simuliere Laden der Dashboard-Daten
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-project':
        info('Projekt erstellen', 'Weiterleitung zur Projekterstellung...')
        break
      case 'new-customer':
        info('Kunde hinzufügen', 'Weiterleitung zur Kundenverwaltung...')
        break
      case 'ai-generate':
        success('KI-Assistent', 'KI-Layout-Generator wird gestartet...')
        break
      case 'browse-templates':
        info('Templates', 'Weiterleitung zur Template-Bibliothek...')
        break
      case 'view-analytics':
        info('Analytics', 'Erweiterte Statistiken werden geladen...')
        break
      default:
        break
    }
  }

  const handleTaskComplete = (taskId: string) => {
    success('Aufgabe erledigt', 'Die Aufgabe wurde als erledigt markiert.')
  }

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Loading Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Willkommen zurück! Hier ist eine Übersicht über Ihre Projekte und Kunden.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            placeholder="Projekte oder Kunden suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:w-64"
          />
          <Button 
            variant="pixelmagix" 
            leftIcon={Icons.plus}
            onClick={() => handleQuickAction('new-project')}
          >
            Neues Projekt
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Kunden"
          value={mockStats.totalCustomers}
          icon={Icons.users}
          trend={{
            value: 12,
            label: 'vs. letzter Monat',
            type: 'increase',
          }}
          description="Aktive Kunden"
        />
        
        <StatsCard
          title="Aktive Projekte"
          value={mockStats.activeProjects}
          icon={Icons.projects}
          trend={{
            value: 3,
            label: 'neue diese Woche',
            type: 'increase',
          }}
          description="In Bearbeitung"
        />
        
        <StatsCard
          title="Abgeschlossen"
          value={mockStats.completedProjects}
          icon={Icons.completed}
          description="Erfolgreich ausgeliefert"
        />
        
        <StatsCard
          title="Umsatz"
          value={formatCurrency(mockStats.totalRevenue)}
          icon={Icons.revenue}
          trend={{
            value: mockStats.monthlyGrowth,
            label: 'Wachstum',
            type: 'increase',
          }}
          description="Diesen Monat"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          title="Projekt erstellen"
          description="Starten Sie ein neues Landingpage-Projekt mit KI-Unterstützung"
          icon={Icons.projects}
          action={{
            label: 'Projekt anlegen',
            onClick: () => handleQuickAction('new-project'),
          }}
        />
        
        <FeatureCard
          title="Kunde hinzufügen"
          description="Neue Kundendaten erfassen und Projekthistorie verwalten"
          icon={Icons.users}
          action={{
            label: 'Kunde anlegen',
            onClick: () => handleQuickAction('new-customer'),
          }}
        />
        
        <FeatureCard
          title="Template durchsuchen"
          description="Entdecken Sie neue professionelle Templates für Ihre Projekte"
          icon={Icons.template}
          action={{
            label: 'Templates ansehen',
            onClick: () => handleQuickAction('browse-templates'),
          }}
        />
        
        <FeatureCard
          title="KI-Assistent"
          description="Automatische Layout-Generierung basierend auf Kundeninhalten"
          icon={Icons.ai}
          badge="Beta"
          action={{
            label: 'KI starten',
            onClick: () => handleQuickAction('ai-generate'),
          }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recent Projects & Chart */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Aktuelle Projekte</CardTitle>
              <Link 
                to="/projects" 
                className="text-sm text-pixelmagix-600 hover:text-pixelmagix-500 font-medium flex items-center"
              >
                Alle anzeigen {Icons.arrow}
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRecentProjects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{project.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(project.priority)}`}>
                          {getPriorityLabel(project.priority)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {project.customer} • Fällig: {formatDate(project.dueDate)}
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-pixelmagix-600 h-2 rounded-full transition-all" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-muted-foreground">
                        Fortschritt: {project.progress}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(project.lastUpdate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {mockRecentProjects.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Icons.projects />
                  <p className="mt-2">Noch keine Projekte vorhanden</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleQuickAction('new-project')}
                  >
                    Erstes Projekt erstellen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-pixelmagix-600">{Icons.chart}</span>
                <span>Wöchentliche Übersicht</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {mockStats.weeklyStats.map((week, index) => (
                  <div key={week.week} className="text-center">
                    <div 
                      className="bg-pixelmagix-100 dark:bg-pixelmagix-900 rounded-lg p-3 mb-2 relative"
                      style={{ height: `${(week.projects / 7) * 100 + 40}px` }}
                    >
                      <div 
                        className="bg-pixelmagix-600 rounded absolute bottom-2 left-2 right-2 transition-all"
                        style={{ height: `${(week.projects / 7) * 60}px` }}
                      />
                    </div>
                    <p className="text-xs font-medium">{week.week}</p>
                    <p className="text-xs text-muted-foreground">{week.projects} Projekte</p>
                    <p className="text-xs text-pixelmagix-600 font-medium">
                      {formatCurrency(week.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activities & Tasks */}
        <div className="space-y-8">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                <span className="text-yellow-600">{Icons.clock}</span>
                <span>Anstehende Aufgaben</span>
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {mockUpcomingTasks.length}
              </span>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockUpcomingTasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTaskComplete(task.id)}
                      className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                    >
                      {Icons.check}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(task.dueDate)}
                    </p>
                  </div>
                  {task.project && (
                    <p className="text-xs text-pixelmagix-600 mt-1">{task.project}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                <span className="text-blue-600">{Icons.bell}</span>
                <span>Letzte Aktivitäten</span>
              </CardTitle>
              <Link 
                to="/activities" 
                className="text-sm text-pixelmagix-600 hover:text-pixelmagix-500 font-medium"
              >
                Alle anzeigen
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Customers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Neueste Kunden</CardTitle>
              <Link 
                to="/customers" 
                className="text-sm text-pixelmagix-600 hover:text-pixelmagix-500 font-medium flex items-center"
              >
                Alle anzeigen {Icons.arrow}
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockRecentCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-pixelmagix-600 flex items-center justify-center text-white font-medium text-sm">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{customer.name}</h4>
                      {customer.status === 'new' && (
                        <span className="flex-shrink-0 text-green-600">{Icons.star}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{customer.company}</p>
                    <p className="text-xs text-muted-foreground">
                      {customer.projects} Projekt{customer.projects !== 1 ? 'e' : ''} • 
                      {formatRelativeTime(customer.lastContact)}
                    </p>
                  </div>
                </div>
              ))}
              
              {mockRecentCustomers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Icons.users />
                  <p className="mt-2">Noch keine Kunden vorhanden</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleQuickAction('new-customer')}
                  >
                    Ersten Kunden hinzufügen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-pixelmagix-600">{Icons.ai}</span>
            <span>KI-Nutzung & Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-pixelmagix-50 to-blue-50 dark:from-pixelmagix-950 dark:to-blue-950 rounded-lg border border-pixelmagix-200 dark:border-pixelmagix-800">
              <p className="text-2xl font-bold text-pixelmagix-600">{mockStats.aiUsage}</p>
              <p className="text-sm text-muted-foreground">Generierte Layouts</p>
              <p className="text-xs text-pixelmagix-600 mt-1">+15% diese Woche</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-2xl font-bold text-green-600">98%</p>
              <p className="text-sm text-muted-foreground">Erfolgsrate</p>
              <p className="text-xs text-green-600 mt-1">Sehr gut</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-2xl font-bold text-blue-600">~2.3s</p>
              <p className="text-sm text-muted-foreground">Ø Generierungszeit</p>
              <p className="text-xs text-blue-600 mt-1">Sehr schnell</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-2xl font-bold text-purple-600">4.8/5</p>
              <p className="text-sm text-muted-foreground">Nutzerbewertung</p>
              <div className="flex justify-center space-x-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xs ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`}>
                    {Icons.star}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}