import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/toast'
import { ThemeProvider } from './components/providers/theme-provider'
import { AppLayout } from './components/layout/app-layout'

// Feature Pages (Lazy Loading für bessere Performance)
import { lazy, Suspense } from 'react'

// Lazy-loaded Components
const Dashboard = lazy(() => import('./features/dashboard/pages/dashboard-page'))
const Customers = lazy(() => import('./features/customers/pages/customers-page'))
const CustomerDetail = lazy(() => import('./features/customers/pages/customer-detail-page'))
const Projects = lazy(() => import('./features/projects/pages/projects-page'))
const ProjectDetail = lazy(() => import('./features/projects/pages/project-detail-page'))
const VisualBuilder = lazy(() => import('./features/visual-builder/pages/visual-builder-page'))
const Templates = lazy(() => import('./features/templates/pages/templates-page'))
const Invoices = lazy(() => import('./features/invoices/pages/invoices-page'))
const Settings = lazy(() => import('./features/settings/pages/settings-page'))

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
          
          {