import { cn } from '../../lib/utils'

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border transition-colors', className)}
      {...props}
    >
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn('px-6 py-4 border-b border-gray-100 dark:border-dark-border', className)}
      {...props}
    >
      {children}
    </div>
  )
}

Card.Title = function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

Card.Description = function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-sm text-gray-500 dark:text-gray-400 mt-1', className)} {...props}>
      {children}
    </p>
  )
}

Card.Body = function CardBody({ className, children, ...props }) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  )
}

Card.Footer = function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('px-6 py-4 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-surface-2 rounded-b-xl', className)}
      {...props}
    >
      {children}
    </div>
  )
}
