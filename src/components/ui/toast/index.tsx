import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

// Toast Types
export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  title?: string
  description?: string
  type: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  toast: (toast: Omit<Toast, 'id'>) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    }

    setToasts(prev => [...prev, newToast])

    // Auto-remove nach duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    toast: addToast,
    success: (title: string, description?: string) =>
      addToast({ type: 'success', title, description }),
    error: (title: string, description?: string) =>
      addToast({ type: 'error', title, description }),
    warning: (title: string, description?: string) =>
      addToast({ type: 'warning', title, description }),
    info: (title: string, description?: string) =>
      addToast({ type: 'info', title, description }),
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  )
}

// Toast Hook
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast Icons
const ToastIcons = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  default: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

// Toast Component
function ToastComponent({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const getToastStyles = (type: ToastType) => {
    const baseStyles = 'border shadow-lg rounded-lg p-4 max-w-md w-full bg-card text-card-foreground'
    
    switch (type) {
      case 'success':
        return cn(baseStyles, 'border-green-200 dark:border-green-800')
      case 'error':
        return cn(baseStyles, 'border-red-200 dark:border-red-800')
      case 'warning':
        return cn(baseStyles, 'border-yellow-200 dark:border-yellow-800')
      case 'info':
        return cn(baseStyles, 'border-blue-200 dark:border-blue-800')
      default:
        return cn(baseStyles, 'border-border')
    }
  }

  const getIconStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'text-green-600 dark:text-green-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'info':
        return 'text-blue-600 dark:text-blue-400'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div
      className={cn(
        getToastStyles(toast.type),
        'animate-in slide-in-from-right-full fade-in duration-300'
      )}
    >
      <div className="flex items-start">
        <div className={cn('flex-shrink-0 mt-0.5', getIconStyles(toast.type))}>
          {ToastIcons[toast.type]}
        </div>
        
        <div className="ml-3 flex-1">
          {toast.title && (
            <p className="text-sm font-medium text-foreground">
              {toast.title}
            </p>
          )}
          {toast.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {toast.description}
            </p>
          )}
          
          {toast.action && (
            <div className="mt-2">
              <button
                onClick={toast.action.onClick}
                className="text-sm font-medium text-pixelmagix-600 hover:text-pixelmagix-500 dark:text-pixelmagix-400 dark:hover:text-pixelmagix-300"
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>

        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onRemove}
            className="inline-flex text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="sr-only">Schließen</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Toaster Container
export function Toaster() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2">
      {toasts.map(toast => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}