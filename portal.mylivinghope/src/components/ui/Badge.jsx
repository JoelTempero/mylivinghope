import { cn, getStatusColor } from '../../lib/utils'

const variants = {
  default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
  primary: 'bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-300',
  secondary: 'bg-secondary-100 dark:bg-secondary-900/40 text-secondary-800 dark:text-secondary-300',
  success: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
  warning: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300',
  danger: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300',
  info: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
  purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export default function Badge({
  className,
  variant = 'default',
  size = 'md',
  status,
  children,
  ...props
}) {
  // If status is provided, use the status color mapping
  const colorClass = status ? getStatusColor(status) : variants[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        colorClass,
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
