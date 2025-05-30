import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // Pixelmagix spezifische Varianten
        pixelmagix: 'bg-pixelmagix-600 text-white hover:bg-pixelmagix-700 shadow-pixelmagix',
        success: 'bg-green-600 text-white hover:bg-green-700',
        warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
        gradient: 'bg-gradient-to-r from-pixelmagix-600 to-blue-600 text-white hover:from-pixelmagix-700 hover:to-blue-700 shadow-pixelmagix-lg',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-12 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button'
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && 'cursor-not-allowed'
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
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
            Lädt...
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

// Icon Button Komponente
export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon'> {
  icon: React.ReactNode
  'aria-label': string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = 'icon', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        className={className}
        {...props}
      >
        {icon}
      </Button>
    )
  }
)
IconButton.displayName = 'IconButton'

// Button Group für zusammenhängende Aktionen
export interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, className, orientation = 'horizontal' }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex',
          orientation === 'horizontal' 
            ? 'rounded-md shadow-sm' 
            : 'flex-col rounded-md shadow-sm',
          className
        )}
        role="group"
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child
          
          const isFirst = index === 0
          const isLast = index === React.Children.count(children) - 1
          
          return React.cloneElement(child, {
            className: cn(
              child.props.className,
              orientation === 'horizontal' ? [
                !isFirst && 'ml-[-1px]',
                !isFirst && !isLast && 'rounded-none',
                isFirst && 'rounded-r-none',
                isLast && 'rounded-l-none',
              ] : [
                !isFirst && 'mt-[-1px]',
                !isFirst && !isLast && 'rounded-none',
                isFirst && 'rounded-b-none',
                isLast && 'rounded-t-none',
              ]
            ),
          })
        })}
      </div>
    )
  }
)
ButtonGroup.displayName = 'ButtonGroup'

// Loading Button für async Aktionen
export interface LoadingButtonProps extends ButtonProps {
  loadingText?: string
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading, loadingText, children, ...props }, ref) => {
    return (
      <Button ref={ref} loading={loading} {...props}>
        {loading && loadingText ? loadingText : children}
      </Button>
    )
  }
)
LoadingButton.displayName = 'LoadingButton'

export { Button, IconButton, ButtonGroup, LoadingButton, buttonVariants }
