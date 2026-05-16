import { cn } from '../../lib/utils'

export default function Table({ className, children, ...props }) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  )
}

Table.Head = function TableHead({ className, children, ...props }) {
  return (
    <thead className={cn('bg-gray-50 dark:bg-dark-surface-2', className)} {...props}>
      {children}
    </thead>
  )
}

Table.Body = function TableBody({ className, children, ...props }) {
  return (
    <tbody className={cn('divide-y divide-gray-100 dark:divide-dark-border', className)} {...props}>
      {children}
    </tbody>
  )
}

Table.Row = function TableRow({ className, onClick, children, ...props }) {
  return (
    <tr
      className={cn(
        'hover:bg-gray-50 dark:hover:bg-dark-surface-2 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </tr>
  )
}

Table.HeaderCell = function TableHeaderCell({
  className,
  sortable,
  sorted,
  sortDirection,
  onSort,
  children,
  ...props
}) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider',
        sortable && 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-300',
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && sorted && (
          <span className="text-primary-500">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  )
}

Table.Cell = function TableCell({ className, children, ...props }) {
  return (
    <td className={cn('px-4 py-3 text-gray-900 dark:text-gray-100', className)} {...props}>
      {children}
    </td>
  )
}

// Empty state component
Table.Empty = function TableEmpty({
  icon: Icon,
  title = 'No data',
  description = 'Get started by creating a new item.',
  action,
}) {
  return (
    <tr>
      <td colSpan="100%" className="px-4 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          {Icon && (
            <div className="w-12 h-12 bg-gray-100 dark:bg-dark-surface-2 rounded-full flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          {action && <div className="mt-4">{action}</div>}
        </div>
      </td>
    </tr>
  )
}

// Loading state component
Table.Loading = function TableLoading({ columns = 5, rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: columns }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-gray-200 dark:bg-dark-surface-2 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
