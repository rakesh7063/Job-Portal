import clsx from 'clsx'
import { forwardRef } from 'react'

export const Input = forwardRef(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={clsx(
          'w-full px-4 py-2 text-base border border-gray-300 rounded-lg',
          'bg-white text-gray-900 transition-colors',
          'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'dark:focus:ring-blue-400',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          'dark:disabled:bg-gray-700 dark:disabled:text-gray-400',
          error && 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export function FormGroup({ label, error, children, required = false, helperText }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
      {helperText && <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
    </div>
  )
}
