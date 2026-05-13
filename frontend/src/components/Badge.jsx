import clsx from 'clsx'

export function Badge({ variant = 'primary', className, children, ...props }) {
  const variantStyles = {
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export function LoadingSpinner({ size = 'md', className }) {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={clsx(
          'border-gray-300 border-t-blue-600 rounded-full animate-spin dark:border-gray-600 dark:border-t-blue-400',
          sizeStyles[size],
          className
        )}
      />
    </div>
  )
}

export function SkeletonLoader({ className }) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-200 rounded-lg dark:bg-gray-700',
        className
      )}
    />
  )
}
