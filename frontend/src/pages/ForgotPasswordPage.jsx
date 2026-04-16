import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../shared/api/apiClient.js'
import { forgotPassword } from '../shared/api/authApi.js'
import { FormErrorAlert } from '../shared/ui/FormErrorAlert.jsx'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [ok, setOk] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    setOk('')
    try {
      const res = await forgotPassword({ email, password })
      setOk(typeof res === 'string' ? res : 'Password updated successfully.')
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2 : new Error('Password update failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid" style={{ placeItems: 'center' }}>
      <div className="card" style={{ width: 'min(560px, 100%)' }}>
        <div className="cardBody">
          <h1 className="title">Reset Password</h1>
          <p className="subtitle">Enter your email and new password to regain access.</p>

          <form className="grid" onSubmit={onSubmit} style={{ marginTop: 14 }}>
            <div className="field">
              <div className="label">Email</div>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="field">
              <div className="label">New password</div>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 chars, upper/lower/number/special" />
            </div>

            <FormErrorAlert error={err} fallback="Password update failed" />
            {ok ? <div className="success">{ok}</div> : null}

            <div className="row" style={{ justifyContent: 'space-between' }}>
              <button className="btn btnPrimary" disabled={loading} type="submit">
                {loading ? 'Updating…' : 'Update password'}
              </button>
              <Link className="btn" to="/login">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

