import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTheme } from '../theme/ThemeProvider.jsx'
import '../ui/ui.css'

function ThemeSelect() {
  const { mode, setMode } = useTheme()
  return (
    <select className="select" value={mode} onChange={(e) => setMode(e.target.value)}>
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  )
}

export function AppShell() {
  const auth = useAuth()
  const nav = useNavigate()

  const onLogout = () => {
    auth.logout()
    nav('/', { replace: true })
  }

  return (
    <div className="appShell">
      <header className="nav">
        <div className="container navInner">
          <Link className="brand" to="/">
            Rojgar <span className="badge">Secure</span>
          </Link>

          <nav className="navLinks">
            <NavLink className="btn" to="/jobs">
              Jobs
            </NavLink>

            {auth.role === 'ROLE_CANDIDATE' ? (
              <NavLink className="btn" to="/candidate/profile">
                Profile
              </NavLink>
            ) : null}

            {auth.role === 'ROLE_RECRUITER' ? (
              <>
                <NavLink className="btn" to="/recruiter/jobs">
                  My Jobs
                </NavLink>
                <NavLink className="btn btnPrimary" to="/recruiter/jobs/new">
                  Post Job
                </NavLink>
              </>
            ) : null}

            <div style={{ width: 160 }}>
              <ThemeSelect />
            </div>

            {auth.isAuthed ? (
              <>
                <span className="navUser">Welcome, {auth.name || auth.email || 'User'}</span>
                <button className="btn btnDanger" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className="btn" to="/login">
                  Login
                </NavLink>
                <NavLink className="btn btnPrimary" to="/register">
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="muted">© 2026 Rojgar. All rights reserved.</span>
            <span className="muted">Made with ❤️</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

