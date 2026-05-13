import clsx from 'clsx'

export function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md',
        'dark:border-gray-700 dark:bg-gray-800',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={clsx('border-b border-gray-200 px-6 py-4 dark:border-gray-700', className)} {...props}>
      {children}
    </div>
  )
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={clsx('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={clsx('border-t border-gray-200 px-6 py-4 dark:border-gray-700', className)} {...props}>
      {children}
    </div>
  )
}
