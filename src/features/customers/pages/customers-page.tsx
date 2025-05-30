import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { SearchInput } from '../../../components/ui/input'
import { useToast } from '../../../components/ui/toast'

// Mock Data - später durch echte API-Calls ersetzen
const mockCustomers = [
  {
    id: '1',
    name: 'Dr. Schmidt',
    company: 'Zahnarztpraxis Schmidt',
    email: 'schmidt@praxis.de',
    phone: '+49 89 123456',
    website: 'www.praxis-schmidt.de',
    projects: 2,
    totalRevenue: 4500,
    lastContact: '2025-05-28',
    status: 'active',
  },
  {
    id: '2',
    name: 'Mario Rossi',
    company: 'Restaurant Bella Vista',
    email: 'mario@bellavista.de',
    phone: '+49 89 654321',
    website: 'www.bellavista.de',
    projects: 1,
    totalRevenue: 2800,
    lastContact: '2025-05-29',
    status: 'active',
  },
  {
    id: '3',
    name: 'Sarah Mueller',
    company: 'PowerGym GmbH',
    email: 's.mueller@powergym.de',
    phone: '+49 89 987654',
    website: 'www.powergym.de',
    projects: 3,
    totalRevenue: 7200,
    lastContact: '2025-05-27',
    status: 'active',
  },
]

// Icons
const Icons = {
  plus: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  mail: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  phone: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  web: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  projects: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  euro: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ),
  settings: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [customers] = useState(mockCustomers)
  const { success, info } = useToast()

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleQuickAction = (action: string, customerId?: string) => {
    switch (action) {
      case 'new-customer':
        info('Kunde hinzufügen', 'Weiterleitung zum Kundenformular...')
        break
      case 'edit-customer':
        info('Kunde bearbeiten', `Weiterleitung zu Kunde ${customerId}...`)
        break
      case 'new-project':
        success('Neues Projekt', `Projekt für Kunde ${customerId} wird erstellt...`)
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
          <h1 className="text-3xl font-bold text-foreground">Kunden</h1>
          <p className="text-muted-foreground mt-1">
            Verwalten Sie Ihre Kunden und deren Projekte
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            placeholder="Kunden suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:w-64"
          />
          <Button 
            variant="pixelmagix" 
            leftIcon={Icons.plus}
            onClick={() => handleQuickAction('new-customer')}
          >
            Kunde hinzufügen
          </Button>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="customer-card" hover="border">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-pixelmagix-600 flex items-center justify-center text-white font-medium">
                    {getInitials(customer.name)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{customer.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{customer.company}</p>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuickAction('edit-customer', customer.id)}
                    className="h-8 w-8"
                  >
                    {Icons.settings}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  {Icons.mail}
                  <span className="truncate">{customer.email}</span>
                </div>
                
                {customer.phone && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    {Icons.phone}
                    <span>{customer.phone}</span>
                  </div>
                )}
                
                {customer.website && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    {Icons.web}
                    <span className="truncate">{customer.website}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-pixelmagix-600 mb-1">
                    {Icons.projects}
                    <span className="text-lg font-semibold">{customer.projects}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Projekt{customer.projects !== 1 ? 'e' : ''}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                    {Icons.euro}
                    <span className="text-lg font-semibold">
                      {formatCurrency(customer.totalRevenue).replace('€', '').replace(',00', '')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Umsatz</p>
                </div>
              </div>

              {/* Last Contact */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Letzter Kontakt: {formatDate(customer.lastContact)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleQuickAction('edit-customer', customer.id)}
                >
                  Details
                </Button>
                <Button
                  variant="pixelmagix"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleQuickAction('new-project', customer.id)}
                >
                  Neues Projekt
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchQuery ? 'Keine Kunden gefunden' : 'Noch keine Kunden vorhanden'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? `Keine Kunden entsprechen der Suche "${searchQuery}"`
              : 'Fügen Sie Ihren ersten Kunden hinzu, um zu beginnen'
            }
          </p>
          {!searchQuery && (
            <Button
              variant="pixelmagix"
              onClick={() => handleQuickAction('new-customer')}
              leftIcon={Icons.plus}
            >
              Ersten Kunden hinzufügen
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
