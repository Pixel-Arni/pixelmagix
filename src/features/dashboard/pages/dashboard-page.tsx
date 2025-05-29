import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, StatsCard, FeatureCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast-provider'

// Mock Data - später durch echte API-Calls ersetzen
const mockStats = {
  totalCustomers: 24,
  activeProjects: 12,
  completedProjects: 45,
  totalRevenue: 12750,
  monthlyGrowth: 8.2,
  aiUsage: 234,
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
  },
  {
    id: '2',
    name: 'Restaurant "Bella Vista"',
    customer: 'Mario Rossi',
    status: 'review',
    progress: 95,
    dueDate: '2025-06-10',
    lastUpdate: '2025-05-29',
  },
  {
    id: '3',
    name: 'Fitness Studio Launch',
    customer: 'PowerGym GmbH',
    status: 'draft',
    progress: 25,
    dueDate: '2025-07-01',
    lastUpdate: '2025-05-27',
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
  },
  {
    id: '2',
    name: 'Mario Rossi',
    company: 'Restaurant Bella Vista',
    email: 'mario@bellavista.de',
    projects: 1,
    lastContact: '2025-05-29',
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

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { success, info } = useToast()

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-project':
        info('Projekt erstellen', 'Weiterleitung zur Projekterstellung...')
        // Hier würde normalerweise Navigation stattfinden
        break
      case 'new-customer':
        info('Kunde hinzufügen', 'Weiterleitung zur Kundenverwaltung...')
        break
      case 'ai-generate':
        success('KI-Assistent', 'KI-Layout-Generator wird gestartet...')
        break
      default:
        break
    }
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
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            {mockRecentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{project.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {project.customer} • Fällig: {formatDate(project.dueDate)}
                  </p>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className="bg-pixelmagix-600 h-1.5 rounded-full transition-all" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-right text-muted-foreground mt-1">
                    {project.progress}%
                  </p>
                </div>
              </div>
            ))}
            
            {mockRecentProjects.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Noch keine Projekte vorhanden</p>
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
          <CardContent className="space-y-4">
            {mockRecentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-pixelmagix-600 flex items-center justify-center text-white font-medium text-sm">
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{customer.name}</h4>
                  <p className="text-xs text-muted-foreground">{customer.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {customer.projects} Projekt{customer.projects !== 1 ? 'e' : ''} • 
                    Letzter Kontakt: {formatDate(customer.lastContact)}
                  </p>
                </div>
              </div>
            ))}
            
            {mockRecentCustomers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Noch keine Kunden vorhanden</p>
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

      {/* AI Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-pixelmagix-600">{Icons.ai}</span>
            <span>KI-Nutzung</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-pixelmagix-600">{mockStats.aiUsage}</p>
              <p className="text-sm text-muted-foreground">Generierte Layouts</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">98%</p>
              <p className="text-sm text-muted-foreground">Erfolgsrate</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">~2.3s</p>
              <p className="text-sm text-muted-foreground">Ø Generierungszeit</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}