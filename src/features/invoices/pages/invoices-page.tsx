import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast-provider'

// Mock-Daten für Rechnungen
interface Invoice {
  id: string
  invoiceNumber: string
  client: {
    name: string
    email: string
  }
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issueDate: string
  dueDate: string
  projectId?: string
  projectName?: string
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-001',
    client: {
      name: 'TechGadgets GmbH',
      email: 'billing@techgadgets.de',
    },
    amount: 2500.00,
    status: 'paid',
    issueDate: '2023-09-01T10:00:00Z',
    dueDate: '2023-09-15T10:00:00Z',
    projectId: '1',
    projectName: 'E-Commerce Website Redesign',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-002',
    client: {
      name: 'Kreativ Studio',
      email: 'finance@kreativstudio.de',
    },
    amount: 1800.00,
    status: 'sent',
    issueDate: '2023-09-10T14:30:00Z',
    dueDate: '2023-09-24T14:30:00Z',
    projectId: '3',
    projectName: 'Branding & Logo Design',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2023-003',
    client: {
      name: 'Café Sonnenschein',
      email: 'info@cafe-sonnenschein.de',
    },
    amount: 950.00,
    status: 'overdue',
    issueDate: '2023-08-15T09:15:00Z',
    dueDate: '2023-08-29T09:15:00Z',
    projectId: '5',
    projectName: 'Restaurant Website',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2023-004',
    client: {
      name: 'Fitness First',
      email: 'accounting@fitnessfirst.de',
    },
    amount: 1200.00,
    status: 'draft',
    issueDate: '2023-09-20T11:45:00Z',
    dueDate: '2023-10-04T11:45:00Z',
    projectId: '7',
    projectName: 'Fitness App UI Design',
  },
]

export default function InvoicesPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // Simuliere API-Aufruf
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        // In einer echten Anwendung würde hier ein API-Aufruf stehen
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Verwende Mock-Daten
        setInvoices(mockInvoices)
      } catch (error) {
        toast.error('Fehler beim Laden der Rechnungen', 'Bitte versuchen Sie es später erneut.')
        console.error('Error fetching invoices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [toast])

  // Filter-Logik
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (invoice.projectName && invoice.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Formatierungsfunktionen
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE')
  }

  const getStatusBadgeClass = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getStatusLabel = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'Bezahlt'
      case 'sent':
        return 'Gesendet'
      case 'overdue':
        return 'Überfällig'
      case 'draft':
        return 'Entwurf'
      default:
        return status
    }
  }

  const handleCreateInvoice = () => {
    toast.info('Neue Rechnung', 'Funktion wird implementiert...')
  }

  const handleViewInvoice = (invoiceId: string) => {
    // In einer echten Anwendung würde hier zur Rechnungsdetailseite navigiert
    toast.info('Rechnung anzeigen', `Rechnung ${invoiceId} wird geöffnet...`)
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
          <h1 className="text-3xl font-bold">Rechnungen</h1>
          <p className="text-muted-foreground">Verwalten Sie Ihre Rechnungen und verfolgen Sie Zahlungen</p>
        </div>
        
        <Button onClick={handleCreateInvoice}>
          Neue Rechnung erstellen
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Rechnungsübersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Gesamtbetrag</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(invoices.reduce((sum, invoice) => sum + invoice.amount, 0))}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Bezahlt</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(invoices.filter(i => i.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0))}
                    </p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full text-green-600 dark:bg-green-900 dark:text-green-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Ausstehend</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(invoices.filter(i => i.status === 'sent').reduce((sum, invoice) => sum + invoice.amount, 0))}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Überfällig</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(invoices.filter(i => i.status === 'overdue').reduce((sum, invoice) => sum + invoice.amount, 0))}
                    </p>
                  </div>
                  <div className="bg-red-100 p-2 rounded-full text-red-600 dark:bg-red-900 dark:text-red-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Rechnung suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64"
            />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Alle Status</option>
              <option value="draft">Entwurf</option>
              <option value="sent">Gesendet</option>
              <option value="paid">Bezahlt</option>
              <option value="overdue">Überfällig</option>
            </select>
          </div>
          
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Keine Rechnungen gefunden</h3>
              <p className="text-muted-foreground mb-4">Versuchen Sie, Ihre Suchkriterien anzupassen.</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
              }}>
                Filter zurücksetzen
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Rechnungsnr.</th>
                    <th className="text-left py-3 px-4 font-medium">Kunde</th>
                    <th className="text-left py-3 px-4 font-medium">Projekt</th>
                    <th className="text-left py-3 px-4 font-medium">Datum</th>
                    <th className="text-left py-3 px-4 font-medium">Fällig</th>
                    <th className="text-left py-3 px-4 font-medium">Betrag</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">{invoice.invoiceNumber}</td>
                      <td className="py-3 px-4">{invoice.client.name}</td>
                      <td className="py-3 px-4">{invoice.projectName || '-'}</td>
                      <td className="py-3 px-4">{formatDate(invoice.issueDate)}</td>
                      <td className="py-3 px-4">{formatDate(invoice.dueDate)}</td>
                      <td className="py-3 px-4 font-medium">{formatCurrency(invoice.amount)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(invoice.status)}`}>
                          {getStatusLabel(invoice.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewInvoice(invoice.id)}
                          className="h-8 w-8 p-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}