import { useState } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/providers/theme-provider'

// Icons - später durch lucide-react ersetzen
const Icons = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
    </svg>
  ),
  customers: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  projects: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  templates: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  invoices: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5l-5-5v5h5zm-8-1V5a2 2 0 012-2h8a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  menu: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  close: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  logo: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z" />
    </svg>
  ),
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Icons.dashboard,
  },
  {
    name: 'Kunden',
    href: '/customers',
    icon: Icons.customers,
  },
  {
    name: 'Projekte',
    href: '/projects',
    icon: Icons.projects,
  },
  {
    name: 'Templates',
    href: '/templates',
    icon: Icons.templates,
  },
  {
    name: 'Rechnungen',
    href: '/invoices',
    icon: Icons.invoices,
  },
  {
    name: 'Einstellungen',
    href: '/settings',
    icon: Icons.settings,
  },
]

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="app-container">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'sidebar',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="text-pixelmagix-600">
                {Icons.logo}
              </div>
              <span className="text-xl font-bold text-gradient">
                Pixelmagix
              </span>
            </div>
            
            {/* Mobile close button */}
            <button
              className="lg:hidden rounded-md p-2 hover:bg-accent"
              onClick={() => setSidebarOpen(false)}
            >
              {Icons.close}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== '/' && location.pathname.startsWith(item.href))

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-pixelmagix-100 text-pixelmagix-700 dark:bg-pixelmagix-950 dark:text-pixelmagix-300'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <span className={cn(isActive && 'text-pixelmagix-600')}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>© 2025 Pixelmagix</span>
              <span>v0.1.0</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Top header */}
        <header className="header">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden rounded-md p-2 hover:bg-accent"
              onClick={() => setSidebarOpen(true)}
            >
              {Icons.menu}
            </button>

            {/* Breadcrumb / Page title */}
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold text-foreground">
                {getPageTitle(location.pathname)}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* AI Status Indicator */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>KI bereit</span>
            </div>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* User menu placeholder */}
            <div className="w-8 h-8 rounded-full bg-pixelmagix-600 flex items-center justify-center text-white text-sm font-medium">
              P
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function getPageTitle(pathname: string): string {
  const routes: Record<string, string> = {
    '/': 'Dashboard',
    '/customers': 'Kunden',
    '/projects': 'Projekte',
    '/templates': 'Templates',
    '/invoices': 'Rechnungen',
    '/settings': 'Einstellungen',
  }

  // Für dynamische Routen
  if (pathname.startsWith('/customers/')) return 'Kunde bearbeiten'
  if (pathname.startsWith('/projects/')) return 'Projekt bearbeiten'
  if (pathname.startsWith('/builder/')) return 'Visual Builder'

  return routes[pathname] || 'Pixelmagix'
}

// Utility Hook für Layout-State
export function useLayout() {
  const location = useLocation()
  
  return {
    currentPath: location.pathname,
    isBuilder: location.pathname.startsWith('/builder/'),
    // Builder hat volles Layout ohne Sidebar
    shouldHideNavigation: location.pathname.startsWith('/builder/'),
  }
}