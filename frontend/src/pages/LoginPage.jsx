import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../shared/api/apiClient.js'
import { login } from '../shared/api/authApi.js'
import { useAuth } from '../shared/auth/AuthProvider.jsx'
import { FormErrorAlert } from '../shared/ui/FormErrorAlert.jsx'

export function LoginPage() {
  const auth = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const from = loc.state?.from || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      const res = await login({ email, password })
      const backendName = typeof res?.name === 'string' ? res.name.trim() : ''
      const fallbackName = email?.includes('@') ? email.split('@')[0] : email
      auth.setAuth({
        token: res.token,
        role: res.role,
        name: backendName || fallbackName || null,
        email: typeof res?.email === 'string' ? res.email : email,
      })
      nav(from, { replace: true })
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2 : new Error('Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid" style={{ placeItems: 'center' }}>
      <div className="card" style={{ width: 'min(520px, 100%)' }}>
        <div className="cardBody">
          <h1 className="title">Login</h1>
          <p className="subtitle">Use your candidate or recruiter account.</p>

          <form className="grid" onSubmit={onSubmit} style={{ marginTop: 14 }}>
            <div className="field">
              <div className="label">Email</div>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="field">
              <div className="label">Password</div>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            <FormErrorAlert error={err} fallback="Login failed" />

            <div className="row" style={{ justifyContent: 'space-between' }}>
              <button className="btn btnPrimary" disabled={loading} type="submit">
                {loading ? 'Logging in…' : 'Login'}
              </button>
              <Link className="btn" to="/forgot-password">
                Forgot password
              </Link>
            </div>
          </form>

          <div className="row" style={{ marginTop: 14, justifyContent: 'space-between' }}>
            <span className="muted">No account?</span>
            <Link className="btn" to="/register">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

