import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import App from './app.tsx'
import { ToastProvider } from './components/ui/toast'

// WICHTIG: CSS Import - überprüfe ob diese Datei existiert
import './styles/globals.css'

console.log('CSS Import erfolgreich') // Debug-Log

// Query Client für Server State Management
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 Minuten
      retry: (failureCount, error) => {
        // Retry-Logik für verschiedene Fehlertypen
        if (failureCount >= 3) return false
        if (error instanceof Error && error.message.includes('404')) return false
        return true
      },
    },
    mutations: {
      retry: 1,
    },
  },
})

// Error Boundary für Production
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Pixelmagix Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ 
            maxWidth: '28rem', 
            width: '100%', 
            backgroundColor: 'white', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
            borderRadius: '0.5rem', 
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '3rem', 
              height: '3rem', 
              margin: '0 auto 1rem', 
              backgroundColor: '#fee2e2', 
              borderRadius: '50%' 
            }}>
              <span style={{ color: '#dc2626', fontSize: '1.5rem' }}>⚠️</span>
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              Etwas ist schiefgelaufen
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Pixelmagix hat einen unerwarteten Fehler festgestellt.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ 
                width: '100%', 
                backgroundColor: '#0ea5e9', 
                color: 'white', 
                fontWeight: '500', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.375rem', 
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}
            >
              Seite neu laden
            </button>
            {import.meta.env.DEV && this.state.error && (
              <details style={{ marginTop: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#6b7280' }}>
                <summary style={{ cursor: 'pointer' }}>Technische Details</summary>
                <pre style={{ 
                  marginTop: '0.5rem', 
                  whiteSpace: 'pre-wrap', 
                  backgroundColor: '#f3f4f6', 
                  padding: '0.5rem', 
                  borderRadius: '0.25rem',
                  fontSize: '0.625rem'
                }}>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Root Element finden und rendern
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure you have a <div id="root"></div> in your HTML.'
  )
}

const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ToastProvider>
            <App />
          </ToastProvider>
        </BrowserRouter>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
)

// Service Worker Registration (später für Offline-Funktionalität)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}