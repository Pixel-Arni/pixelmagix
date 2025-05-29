import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: 'border-border',
        outline: 'border-2 border-dashed border-muted-foreground/25',
        ghost: 'border-transparent shadow-none',
        pixelmagix: 'border-pixelmagix-200 dark:border-pixelmagix-800 shadow-pixelmagix',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
      hover: {
        none: '',
        lift: 'transition-transform hover:scale-[1.02]',
        glow: 'transition-shadow hover:shadow-lg',
        border: 'transition-colors hover:border-pixelmagix-300',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      hover: 'none',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, hover }), className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

// Stats Card für Dashboard
export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
    type: 'increase' | 'decrease' | 'neutral'
  }
  loading?: boolean
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ 
    title, 
    value, 
    description, 
    icon, 
    trend, 
    loading = false, 
    className, 
    ...props 
  }, ref) => {
    const getTrendColor = (type: 'increase' | 'decrease' | 'neutral') => {
      switch (type) {
        case 'increase':
          return 'text-green-600 dark:text-green-400'
        case 'decrease':
          return 'text-red-600 dark:text-red-400'
        case 'neutral':
          return 'text-muted-foreground'
      }
    }

    const getTrendIcon = (type: 'increase' | 'decrease' | 'neutral') => {
      switch (type) {
        case 'increase':
          return (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7m0 10h-10" />
            </svg>
          )
        case 'decrease':
          return (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M17 7v10m0-10H7" />
            </svg>
          )
        case 'neutral':
          return (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          )
      }
    }

    if (loading) {
      return (
        <Card ref={ref} className={cn('stats-card', className)} {...props}>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-8 w-8 bg-muted rounded"></div>
              </div>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card ref={ref} className={cn('stats-card', className)} hover="glow" {...props}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {icon && (
              <div className="text-pixelmagix-600 dark:text-pixelmagix-400">
                {icon}
              </div>
            )}
          </div>
          
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <div className={cn('flex items-center text-sm', getTrendColor(trend.type))}>
                {getTrendIcon(trend.type)}
                <span className="ml-1">{trend.value}%</span>
              </div>
            )}
          </div>
          
          {(description || trend?.label) && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
              {trend?.label && (
                <span className="ml-1">• {trend.label}</span>
              )}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }
)
StatsCard.displayName = 'StatsCard'

// Feature Card für Landing Pages
export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  icon?: React.ReactNode
  badge?: string
  action?: {
    label: string
    onClick: () => void
  }
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ title, description, icon, badge, action, className, ...props }, ref) => (
    <Card 
      ref={ref} 
      className={cn('feature-card relative overflow-hidden', className)} 
      hover="lift"
      {...props}
    >
      {badge && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pixelmagix-100 text-pixelmagix-800 dark:bg-pixelmagix-900 dark:text-pixelmagix-200">
            {badge}
          </span>
        </div>
      )}
      
      <CardContent className="p-6">
        {icon && (
          <div className="w-12 h-12 bg-pixelmagix-100 dark:bg-pixelmagix-900 rounded-lg flex items-center justify-center mb-4 text-pixelmagix-600 dark:text-pixelmagix-400">
            {icon}
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm font-medium text-pixelmagix-600 hover:text-pixelmagix-500 dark:text-pixelmagix-400 dark:hover:text-pixelmagix-300 transition-colors"
          >
            {action.label} →
          </button>
        )}
      </CardContent>
    </Card>
  )
)
FeatureCard.displayName = 'FeatureCard'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  StatsCard,
  FeatureCard,
  cardVariants,
}