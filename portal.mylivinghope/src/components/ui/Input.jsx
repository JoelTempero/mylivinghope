import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Input = forwardRef(
  ({ className, type = 'text', label, error, hint, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full px-4 py-2 border rounded-lg transition-all duration-200',
            'placeholder-gray-400 dark:placeholder-gray-500',
            'bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            error
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
              : 'border-gray-300 dark:border-dark-border focus:ring-primary-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

// Textarea component
export const Textarea = forwardRef(
  ({ className, label, error, hint, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full px-4 py-2 border rounded-lg transition-all duration-200',
            'placeholder-gray-400 dark:placeholder-gray-500 resize-none',
            'bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            error
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
              : 'border-gray-300 dark:border-dark-border focus:ring-primary-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{hint}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
