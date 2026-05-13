import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTheme } from '../theme/ThemeProvider.jsx'
import { Button } from '../../components'
import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import '../ui/ui.css'

function ThemeSelect() {
  const { mode, setMode } = useTheme()
  return (
    <select
      value={mode}
      onChange={(e) => setMode(e.target.value)}
      className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
    >
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  )
}

function NavLinkItem({ to, children, ...props }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg font-medium transition-colors ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`
      }
      {...props}
    >
      {children}
    </NavLink>
  )
}

export function AppShell() {
  const auth = useAuth()
  const nav = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const onLogout = () => {
    auth.logout()
    nav('/', { replace: true })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="container-custom h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-blue-600 dark:text-blue-400">Rojgar</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Secure
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLinkItem to="/jobs">
              Jobs
            </NavLinkItem>

            {auth.role === 'ROLE_CANDIDATE' && (
              <NavLinkItem to="/candidate/profile">
                Profile
              </NavLinkItem>
            )}

            {auth.role === 'ROLE_RECRUITER' && (
              <>
                <NavLinkItem to="/recruiter/jobs">
                  My Jobs
                </NavLinkItem>
                <NavLinkItem to="/recruiter/jobs/new">
                  Post Job
                </NavLinkItem>
              </>
            )}

            <div className="px-2">
              <ThemeSelect />
            </div>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {auth.isAuthed ? (
              <>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome, <span className="font-semibold">{auth.name || auth.email || 'User'}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-gray-50 p-4 space-y-2 dark:border-gray-700 dark:bg-gray-900">
            <NavLinkItem to="/jobs">
              Jobs
            </NavLinkItem>

            {auth.role === 'ROLE_CANDIDATE' && (
              <NavLinkItem to="/candidate/profile">
                Profile
              </NavLinkItem>
            )}

            {auth.role === 'ROLE_RECRUITER' && (
              <>
                <NavLinkItem to="/recruiter/jobs">
                  My Jobs
                </NavLinkItem>
                <NavLinkItem to="/recruiter/jobs/new">
                  Post Job
                </NavLinkItem>
              </>
            )}

            <div className="pt-2">
              <ThemeSelect />
            </div>

            <div className="pt-2 space-y-2 border-t border-gray-200 dark:border-gray-700">
              {auth.isAuthed ? (
                <>
                  <div className="text-sm text-gray-600 px-4 py-2">
                    Welcome, <span className="font-semibold">{auth.name || auth.email || 'User'}</span>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 justify-center"
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block">
                    <Button variant="outline" size="md" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" className="block">
                    <Button variant="primary" size="md" className="w-full">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container-custom py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-12 dark:border-gray-700 dark:bg-gray-900">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Rojgar. All rights reserved.
            </p>
            <p className="text-sm text-gray-600">
              Made with <span className="text-red-500">❤️</span> for job seekers and recruiters
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

