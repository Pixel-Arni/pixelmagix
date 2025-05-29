import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'dark' | 'light' // Das aktuell aktive Theme (resolved system preference)
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  actualTheme: 'light',
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'pixelmagix-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  
  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    const root = window.document.documentElement

    // Theme von HTML-Element entfernen
    root.classList.remove('light', 'dark')

    let resolvedTheme: 'dark' | 'light'

    if (theme === 'system') {
      // System-Präferenz ermitteln
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      resolvedTheme = systemTheme
    } else {
      resolvedTheme = theme
    }

    // Theme anwenden
    root.classList.add(resolvedTheme)
    setActualTheme(resolvedTheme)
    
    // Meta-Theme-Color für mobile Browser setzen
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        resolvedTheme === 'dark' ? '#0f172a' : '#ffffff'
      )
    }
  }, [theme])

  // System Theme Listener
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (event: MediaQueryListEvent) => {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      
      const newTheme = event.matches ? 'dark' : 'light'
      root.classList.add(newTheme)
      setActualTheme(newTheme)
      
      // Meta-Theme-Color aktualisieren
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content',
          newTheme === 'dark' ? '#0f172a' : '#ffffff'
        )
      }
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      // Legacy browsers
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    actualTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// Custom Hook für Theme-Zugriff
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

// Theme-Wechsel Komponente
export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )
      case 'dark':
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )
      case 'system':
      default:
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        )
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Hell'
      case 'dark':
        return 'Dunkel'
      case 'system':
        return 'System'
      default:
        return 'System'
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
      title={`Aktuell: ${getThemeLabel()}${theme === 'system' ? ` (${actualTheme === 'dark' ? 'Dunkel' : 'Hell'})` : ''}`}
    >
      <span className="sr-only">Theme wechseln</span>
      {getThemeIcon()}
    </button>
  )
}

// Theme-Selector Dropdown (für Settings-Page)
export function ThemeSelector() {
  const { theme, setTheme, actualTheme } = useTheme()

  const themes = [
    { value: 'light', label: 'Hell', icon: '☀️' },
    { value: 'dark', label: 'Dunkel', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ] as const

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Theme-Einstellungen
      </label>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
              theme === t.value
                ? 'border-pixelmagix-500 bg-pixelmagix-50 dark:bg-pixelmagix-950'
                : 'border-border hover:border-pixelmagix-300'
            }`}
          >
            <span className="text-2xl mb-1">{t.icon}</span>
            <span className="text-sm font-medium">{t.label}</span>
            {theme === 'system' && t.value === 'system' && (
              <span className="text-xs text-muted-foreground mt-1">
                ({actualTheme === 'dark' ? 'Dunkel' : 'Hell'})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// Utility Hook für Theme-abhängige Logik
export function useThemeAware() {
  const { actualTheme } = useTheme()
  
  return {
    isDark: actualTheme === 'dark',
    isLight: actualTheme === 'light',
    actualTheme,
    // Theme-abhängige Klassen
    getThemeClass: (lightClass: string, darkClass: string) =>
      actualTheme === 'dark' ? darkClass : lightClass,
  }
}