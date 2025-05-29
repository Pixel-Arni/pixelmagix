import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toast-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AppLayout } from '@/components/layout/app-layout'

// Feature Pages (Lazy Loading für bessere Performance)
import { lazy, Suspense } from 'react'

// Lazy-loaded Components
const Dashboard = lazy(() => import('@/features/dashboard/pages/dashboard-page'))
const Customers = lazy(() => import('@/features/customers/pages/customers-page'))
const CustomerDetail = lazy(() => import('@/features/customers/pages/customer-detail-page'))
const Projects = lazy(() => import('@/features/projects/pages/projects-page'))
const ProjectDetail = lazy(() => import('@/features/projects/pages/project-detail-page'))
const VisualBuilder = lazy(() => import('@/features/visual-builder/pages/visual-builder-page'))
const Templates = lazy(() => import('@/features/templates/pages/templates-page'))
const Invoices = lazy(() => import('@/features/invoices/pages/invoices-page'))
const Settings = lazy(() => import('@/features/settings/pages/settings-page'))

// Loading Spinner Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pixelmagix-600"></div>
      <p className="text-sm text-muted-foreground">Seite wird geladen...</p>
    </div>
  </div>
)

// Suspense Wrapper für Lazy Components
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
)

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="pixelmagix-theme">
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Main App Routes mit Layout */}
          <Route path="/" element={<AppLayout />}>
            {/* Dashboard - Startseite */}
            <Route 
              index 
              element={
                <SuspenseWrapper>
                  <Dashboard />
                </SuspenseWrapper>
              } 
            />
            
            {/* Kundenverwaltung */}
            <Route 
              path="customers" 
              element={
                <SuspenseWrapper>
                  <Customers />
                </SuspenseWrapper>
              } 
            />
            <Route 
              path="customers/:customerId" 
              element={
                <SuspenseWrapper>
                  <CustomerDetail />
                </SuspenseWrapper>
              } 
            />
            
            {/* Projektmanagement */}
            <Route 
              path="projects" 
              element={
                <SuspenseWrapper>
                  <Projects />
                </SuspenseWrapper>
              } 
            />
            <Route 
              path="projects/:projectId" 
              element={
                <SuspenseWrapper>
                  <ProjectDetail />
                </SuspenseWrapper>
              } 
            />
            
            {/* Visual Builder */}
            <Route 
              path="builder/:projectId" 
              element={
                <SuspenseWrapper>
                  <VisualBuilder />
                </SuspenseWrapper>
              } 
            />
            
            {/* Templates */}
            <Route 
              path="templates" 
              element={
                <SuspenseWrapper>
                  <Templates />
                </SuspenseWrapper>
              } 
            />
            
            {/* Rechnungen */}
            <Route 
              path="invoices" 
              element={
                <SuspenseWrapper>
                  <Invoices />
                </SuspenseWrapper>
              } 
            />
            
            {/* Einstellungen */}
            <Route 
              path="settings" 
              element={
                <SuspenseWrapper>
                  <Settings />
                </SuspenseWrapper>
              } 
            />
          </Route>
          
          {/* Fallback Routes */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        
        {/* Global Toast Notifications */}
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

// 404 Page Component
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pixelmagix-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-pixelmagix-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.347 0-4.518-.872-6.127-2.292m0 0A7.962 7.962 0 014 9c0-1.71.432-3.31 1.188-4.684m11.624 0A7.962 7.962 0 0120 9c0 1.71-.432 3.31-1.188 4.684M6.873 6.708a7.962 7.962 0 015.254 0"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Seite nicht gefunden
        </h2>
        <p className="text-gray-600 mb-8">
          Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={() => window.history.back()}
          className="w-full bg-pixelmagix-600 hover:bg-pixelmagix-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Zurück zur vorherigen Seite
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
        >
          Zur Startseite
        </button>
      </div>
    </div>
  </div>
)

export default App