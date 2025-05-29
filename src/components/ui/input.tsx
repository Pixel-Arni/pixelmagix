import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        destructive: 'border-destructive focus-visible:ring-destructive',
        success: 'border-green-500 focus-visible:ring-green-500',
        pixelmagix: 'border-pixelmagix-300 focus-visible:ring-pixelmagix-500',
      },
      inputSize: {
        default: 'h-10',
        sm: 'h-9 px-2 text-xs',
        lg: 'h-11 px-4',
        xl: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
  error?: string
  success?: string
  label?: string
  hint?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    inputSize, 
    type = 'text',
    leftIcon,
    rightIcon,
    loading,
    error,
    success,
    label,
    hint,
    id,
    ...props 
  }, ref) => {
    const inputId = id || React.useId()
    const hasError = !!error
    const hasSuccess = !!success && !hasError
    
    // Bestimme Variante basierend auf Status
    const resolvedVariant = hasError ? 'destructive' : hasSuccess ? 'success' : variant

    const inputElement = (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          className={cn(
            inputVariants({ variant: resolvedVariant, inputSize }),
            leftIcon && 'pl-10',
            (rightIcon || loading) && 'pr-10',
            className
          )}
          ref={ref}
          {...props}
        />
        
        {(rightIcon || loading) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {loading ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8 8 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            ) : (
              rightIcon
            )}
          </div>
        )}
      </div>
    )

    if (label || hint || error || success) {
      return (
        <div className="space-y-2">
          {label && (
            <label 
              htmlFor={inputId}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
          
          {inputElement}
          
          {(hint || error || success) && (
            <div className="space-y-1">
              {hint && !error && !success && (
                <p className="text-xs text-muted-foreground">{hint}</p>
              )}
              {error && (
                <p className="text-xs text-destructive flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {success}
                </p>
              )}
            </div>
          )}
        </div>
      )
    }

    return inputElement
  }
)
Input.displayName = 'Input'

// File Input Komponente
export interface FileInputProps extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  onFileSelect?: (files: FileList | null) => void
  onError?: (error: string) => void
  preview?: boolean
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ 
    accept,
    multiple = false,
    maxSize,
    onFileSelect,
    onError,
    preview = false,
    className,
    ...props 
  }, ref) => {
    const [dragActive, setDragActive] = React.useState(false)
    const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null)

    const validateFiles = (files: FileList): boolean => {
      if (!maxSize) return true

      for (let i = 0; i < files.length; i++) {
        if (files[i].size > maxSize) {
          onError?.(`Datei "${files[i].name}" ist zu groß. Maximum: ${Math.round(maxSize / 1024 / 1024)}MB`)
          return false
        }
      }
      return true
    }

    const handleFiles = (files: FileList | null) => {
      if (!files) return

      if (validateFiles(files)) {
        setSelectedFiles(files)
        onFileSelect?.(files)
      }
    }

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true)
      } else if (e.type === 'dragleave') {
        setDragActive(false)
      }
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      
      if (e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files)
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
    }

    return (
      <div className="space-y-2">
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-6 transition-colors',
            dragActive 
              ? 'border-pixelmagix-500 bg-pixelmagix-50 dark:bg-pixelmagix-950' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            className
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-foreground">
                  Dateien hierher ziehen oder klicken zum Auswählen
                </span>
                <input
                  ref={ref}
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  accept={accept}
                  multiple={multiple}
                  onChange={handleChange}
                  {...props}
                />
              </label>
              <p className="mt-1 text-xs text-muted-foreground">
                {accept && `Unterstützte Formate: ${accept}`}
                {maxSize && ` • Max. ${Math.round(maxSize / 1024 / 1024)}MB`}
              </p>
            </div>
          </div>
        </div>

        {/* File Preview */}
        {preview && selectedFiles && (
          <div className="space-y-2">
            {Array.from(selectedFiles).map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded border"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-foreground">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    // File entfernen (vereinfacht)
                    setSelectedFiles(null)
                    onFileSelect?.(null)
                  }}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)
FileInput.displayName = 'FileInput'

export { Input, SearchInput, Textarea, FileInput, inputVariants }

// Search Input Komponente
export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type'> {
  onSearch?: (value: string) => void
  onClear?: () => void
  showClearButton?: boolean
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ 
    onSearch, 
    onClear, 
    showClearButton = true, 
    placeholder = 'Suchen...', 
    className,
    value,
    onChange,
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || '')
    const isControlled = value !== undefined

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onChange?.(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch?.(isControlled ? String(value) : internalValue)
      }
    }

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue('')
      }
      onClear?.()
    }

    const currentValue = isControlled ? value : internalValue
    const showClear = showClearButton && currentValue

    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        rightIcon={
          showClear ? (
            <button
              type="button"
              onClick={handleClear}
              className="hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : undefined
        }
        className={className}
        {...props}
      />
    )
  }
)
SearchInput.displayName = 'SearchInput'

// Textarea Komponente
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  success?: string
  label?: string
  hint?: string
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    error, 
    success, 
    label, 
    hint, 
    resize = 'vertical',
    id,
    ...props 
  }, ref) => {
    const textareaId = id || React.useId()
    const hasError = !!error
    const hasSuccess = !!success && !hasError

    const textareaElement = (
      <textarea
        id={textareaId}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          hasError && 'border-destructive focus-visible:ring-destructive',
          hasSuccess && 'border-green-500 focus-visible:ring-green-500',
          resize === 'none' && 'resize-none',
          resize === 'vertical' && 'resize-y',
          resize === 'horizontal' && 'resize-x',
          resize === 'both' && 'resize',
          className
        )}
        ref={ref}
        {...props}
      />
    )

    if (label || hint || error || success) {
      return (
        <div className="space-y-2">
          {label && (
            <label 
              htmlFor={textareaId}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
          
          {textareaElement}
          
          {(hint || error || success) && (
            <div className="space-y-1">
              {hint && !error && !success && (
                <p className="text-xs text-muted-foreground">{hint}</p>
              )}
              {error && (
                <p className="text-xs text-destructive flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </p>
              )}
              {success && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24