/// <reference types="vite/client" />

// Vite Environment Variables
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_OPENAI_API_KEY?: string
  readonly VITE_CLAUDE_API_KEY?: string
  readonly VITE_OLLAMA_BASE_URL?: string
  readonly VITE_OLLAMA_MODEL?: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global Development Flag
declare const __DEV__: boolean