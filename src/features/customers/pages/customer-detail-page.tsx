import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, StatsCard } from '../../../components/ui/card'
import { Button, IconButton, ButtonGroup } from '../../../components/ui/button'
import { Input, Textarea } from '../../../components/ui/input'
import { useToast } from '../../../components/ui/toast'

// Mock Customer Data - später durch echte API-Calls ersetzen
const mockCustomer = {
  id: '1',
  name: 'Dr. Michael Schmidt',
  email: 'schmidt@zahnarztpraxis-schmidt.de',
  phone: '+49 89 12345678',
  company: 'Zahnarztpraxis Dr. Schmidt',
  website: 'https://zahnarztpraxis-schmidt.de',
  notes: 'Langjähriger Kunde, spezialisiert auf moderne Zahnmedizin. Benötigt professionelle Website mit Terminbuchung.',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2025-05-20T14:22:00Z',
  address: {
    street: 'Maximilianstraße 42',
    city: 'München',
    zip: '80539',
    country: 'Deutschland'
  },
  projects: [
    {
      id: '1',
      name: 'Praxis Website Relaunch',
      status: 'in-progress',
      progress: 75,
      createdAt: '2025-04-10T09:00:00Z',
      dueDate: '2025-06-15T23:59:59Z'
    },
    {
      id: '2',
      name: 'Terminbuchung System',
      status: 'draft',
      progress: 25,
      createdAt: '2025-05-01T10:15:00Z',
      dueDate: '2025-07-01T23:59:59Z'
    }
  ],
  invoices: [
    {
      id: '1',
      number: 'INV-2025-001',
      amount: 2500,
      status: 'paid',
      dueDate: '2025-05-15T23:59:59Z',
      paidAt: '2025-05-10T12:30:00Z'
    },
    {
      id: '2',
      number: 'INV-2025-008',
      amount: 1200,
      status: 'pending',
      dueDate: '2025-06-30T23:59:59Z'
    }
  ],
  stats: {
    totalProjects: 5,
    activeProjects: 2,
    completedProjects: 3,
    totalRevenue: 12750,
    averageProjectValue: 2550
  }
}

// Icons
const Icons = {
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
  email: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  phone: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  website: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  location: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  plus: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  arrow: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  back: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
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
    case 'paid':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'overdue':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
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
    case 'paid':
      return 'Bezahlt'
    case 'pending':
      return 'Ausstehend'
    case 'overdue':
      return 'Überfällig'
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

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CustomerDetailPage() {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const { success, error } = useToast()
  
  const [customer, setCustomer] = useState(mockCustomer)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone || '',
    company: customer.company || '',
    website: customer.website || '',
    notes: customer.notes || '',
    address: {
      street: customer.address?.street || '',
      city: customer.address?.city || '',
      zip: customer.address?.zip || '',
      country: customer.address?.country || ''
    }
  })

  // Simuliere Laden der Kundendaten
  useEffect(() => {
    setLoading(true)
    // Hier würde normalerweise ein API-Call stattfinden
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [customerId])

  const handleSave = async () => {
    setLoading(true)
    try {
      // Hier würde normalerweise ein API-Call stattfinden
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCustomer(prev => ({
        ...prev,
        ...editForm,
        updatedAt: new Date().toISOString()
      }))
      
      setIsEditing(false)
      success('Kunde aktualisiert', 'Die Kundendaten wurden erfolgreich gespeichert.')
    } catch (err) {
      error('Fehler beim Speichern', 'Die Kundendaten konnten nicht gespeichert werden.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      company: customer.company || '',
      website: customer.website || '',
      notes: customer.notes || '',
      address: {
        street: customer.address?.street || '',
        city: customer.address?.city || '',
        zip: customer.address?.zip || '',
        country: customer.address?.country || ''
      }
    })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Kunden löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      return
    }

    setLoading(true)
    try {
      // Hier würde normalerweise ein API-Call stattfinden
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      success('Kunde gelöscht', 'Der Kunde wurde erfolgreich gelöscht.')
      navigate('/customers')
    } catch (err) {
      error('Fehler beim Löschen', 'Der Kunde konnte nicht gelöscht werden.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = () => {
    success('Projekt erstellen', 'Weiterleitung zur Projekterstellung...')
    // Hier würde Navigation zur Projekterstellungsseite stattfinden
  }

  const handleCreateInvoice = () => {
    success('Rechnung erstellen', 'Weiterleitung zur Rechnungserstellung...')
    // Hier würde Navigation zur Rechnungserstellungsseite stattfinden
  }

  const handleContactAction = (type: 'email' | 'phone' | 'website') => {
    switch (type) {
      case 'email':
        window.open(`mailto:${customer.email}`)
        break
      case 'phone':
        window.open(`tel:${customer.phone}`)
        break
      case 'website':
        if (customer.website) {
          window.open(customer.website, '_blank')
        }
        break
    }
  }

  if (loading && !customer) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/customers')}
            leftIcon={Icons.back}
          >
            Zurück
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {customer.name}
            </h1>
            <p className="text-muted-foreground">
              Kunde seit {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <ButtonGroup>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                leftIcon={Icons.edit}
              >
                Bearbeiten
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                leftIcon={Icons.delete}
                loading={loading}
              >
                Löschen
              </Button>
            </ButtonGroup>
          ) : (
            <ButtonGroup>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Abbrechen
              </Button>
              <Button
                variant="pixelmagix"
                onClick={handleSave}
                loading={loading}
              >
                Speichern
              </Button>
            </ButtonGroup>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Kundendaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p className="text-foreground">{customer.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Unternehmen</label>
                      <p className="text-foreground">{customer.company || '-'}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="text-muted-foreground">{Icons.email}</div>
                      <button
                        onClick={() => handleContactAction('email')}
                        className="text-pixelmagix-600 hover:text-pixelmagix-500 hover:underline"
                      >
                        {customer.email}
                      </button>
                    </div>

                    {customer.phone && (
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="text-muted-foreground">{Icons.phone}</div>
                        <button
                          onClick={() => handleContactAction('phone')}
                          className="text-pixelmagix-600 hover:text-pixelmagix-500 hover:underline"
                        >
                          {customer.phone}
                        </button>
                      </div>
                    )}

                    {customer.website && (
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="text-muted-foreground">{Icons.website}</div>
                        <button
                          onClick={() => handleContactAction('website')}
                          className="text-pixelmagix-600 hover:text-pixelmagix-500 hover:underline"
                        >
                          {customer.website}
                        </button>
                      </div>
                    )}

                    {customer.address && (
                      <div className="flex items-start space-x-3 text-sm">
                        <div className="text-muted-foreground mt-0.5">{Icons.location}</div>
                        <div>
                          <p>{customer.address.street}</p>
                          <p>{customer.address.zip} {customer.address.city}</p>
                          <p>{customer.address.country}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {customer.notes && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Notizen</label>
                      <p className="text-foreground mt-1 text-sm leading-relaxed">
                        {customer.notes}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Name"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    <Input
                      label="Unternehmen"
                      value={editForm.company}
                      onChange={(e) => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="E-Mail"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    <Input
                      label="Telefon"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <Input
                    label="Website"
                    value={editForm.website}
                    onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Straße"
                      value={editForm.address.street}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        address: { ...prev.address, street: e.target.value }
                      }))}
                    />
                    <Input
                      label="PLZ"
                      value={editForm.address.zip}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        address: { ...prev.address, zip: e.target.value }
                      }))}
                    />
                    <Input
                      label="Stadt"
                      value={editForm.address.city}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        address: { ...prev.address, city: e.target.value }
                      }))}
                    />
                  </div>

                  <Input
                    label="Land"
                    value={editForm.address.country}
                    onChange={(e) => setEditForm(prev => ({
                      ...prev,
                      address: { ...prev.address, country: e.target.value }
                    }))}
                  />

                  <Textarea
                    label="Notizen"
                    value={editForm.notes}
                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Projekte</CardTitle>
              <Button
                size="sm"
                variant="pixelmagix"
                onClick={handleCreateProject}
                leftIcon={Icons.plus}
              >
                Neues Projekt
              </Button>
            </CardHeader>
            <CardContent>
              {customer.projects.length > 0 ? (
                <div className="space-y-4">
                  {customer.projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{project.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {getStatusLabel(project.status)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Erstellt: {formatDate(project.createdAt)}</span>
                          <span>Fällig: {formatDate(project.dueDate)}</span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-pixelmagix-600 h-2 rounded-full transition-all" 
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-right text-muted-foreground mt-1">
                            {project.progress}%
                          </p>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-pixelmagix-600 hover:text-pixelmagix-500"
                        >
                          {Icons.arrow}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Noch keine Projekte für diesen Kunden</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleCreateProject}
                  >
                    Erstes Projekt erstellen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aktionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="pixelmagix"
                className="w-full"
                onClick={handleCreateProject}
                leftIcon={Icons.plus}
              >
                Neues Projekt
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCreateInvoice}
                leftIcon={Icons.plus}
              >
                Rechnung erstellen
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleContactAction('email')}
                leftIcon={Icons.email}
              >
                E-Mail senden
              </Button>
            </CardContent>
          </Card>

          {/* Customer Stats */}
          <div className="grid grid-cols-1 gap-4">
            <StatsCard
              title="Projekte gesamt"
              value={customer.stats.totalProjects}
              description="Alle Projekte"
            />
            <StatsCard
              title="Aktive Projekte"
              value={customer.stats.activeProjects}
              description="In Bearbeitung"
            />
            <StatsCard
              title="Gesamtumsatz"
              value={formatCurrency(customer.stats.totalRevenue)}
              description="Lebenszeit-Wert"
            />
          </div>

          {/* Recent Invoices */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Rechnungen</CardTitle>
              <Link
                to="/invoices"
                className="text-sm text-pixelmagix-600 hover:text-pixelmagix-500 font-medium"
              >
                Alle anzeigen
              </Link>
            </CardHeader>
            <CardContent>
              {customer.invoices.length > 0 ? (
                <div className="space-y-3">
                  {customer.invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3 border border-border rounded"
                    >
                      <div>
                        <p className="font-medium text-sm">{invoice.number}</p>
                        <p className="text-xs text-muted-foreground">
                          Fällig: {formatDate(invoice.dueDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {getStatusLabel(invoice.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">Keine Rechnungen vorhanden</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
