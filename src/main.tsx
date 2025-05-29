import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import App from './App.tsx'
import { ToastProvider } from '@/components/ui/toaster'
import '@/styles/globals.css'

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
    // Hier könnte später Error-Reporting hinzugefügt werden
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Etwas ist schiefgelaufen
            </h1>
            <p className="text-gray-600 text-center mb-4">
              Pixelmagix hat einen unerwarteten Fehler festgestellt.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-pixelmagix-600 hover:bg-pixelmagix-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Seite neu laden
            </button>
            {__DEV__ && this.state.error && (
              <details className="mt-4 text-sm text-gray-500">
                <summary className="cursor-pointer">Technische Details</summary>
                <pre className="mt-2 whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs">
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
        {__DEV__ && <ReactQueryDevtools initialIsOpen={false} />}
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