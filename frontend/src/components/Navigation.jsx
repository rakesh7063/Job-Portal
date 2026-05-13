import clsx from 'clsx'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function MobileMenu({ isOpen, onClose, children }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={clsx(
          'fixed top-16 left-0 right-0 bottom-0 bg-white z-50 md:hidden transform transition-transform duration-300 dark:bg-gray-900',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-4 space-y-2">{children}</div>
      </div>
    </>
  )
}

export function Navigation({ children, mobileMenuOpen, onMobileMenuToggle }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleToggle = () => {
    setIsMobileOpen(!isMobileOpen)
    onMobileMenuToggle?.(!isMobileOpen)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">{children}</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">{children}</div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleToggle}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)}>
        {children}
      </MobileMenu>
    </nav>
  )
}
