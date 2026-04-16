import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../shared/api/apiClient.js'
import { registerCandidate, registerRecruiter } from '../shared/api/authApi.js'
import { FormErrorAlert } from '../shared/ui/FormErrorAlert.jsx'

export function RegisterPage() {
  const nav = useNavigate()
  const [type, setType] = useState('candidate') // candidate | recruiter

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('0')
  const [skills, setSkills] = useState('')
  const [location, setLocation] = useState('')

  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [ok, setOk] = useState('')

  const isRecruiter = type === 'recruiter'

  const payload = useMemo(() => {
    if (isRecruiter) {
      return { name, company, email, password }
    }
    return {
      name,
      email,
      password,
      experience: Number(experience || 0),
      skills,
      location,
    }
  }, [isRecruiter, name, company, email, password, experience, skills, location])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    setOk('')
    try {
      if (isRecruiter) await registerRecruiter(payload)
      else await registerCandidate(payload)
      setOk('Registration successful. You can now login.')
      setTimeout(() => nav('/login', { replace: true }), 500)
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2 : new Error('Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid" style={{ placeItems: 'center' }}>
      <div className="card" style={{ width: 'min(720px, 100%)' }}>
        <div className="cardBody">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 className="title">Create account</h1>
              <p className="subtitle">Candidate or recruiter — both supported.</p>
            </div>
            <div style={{ width: 180 }}>
              <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="candidate">Candidate</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>
          </div>

          <form className="grid grid2" onSubmit={onSubmit} style={{ marginTop: 14 }}>
            <div className="field">
              <div className="label">Name</div>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>

            {isRecruiter ? (
              <div className="field">
                <div className="label">Company</div>
                <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" />
              </div>
            ) : (
              <div className="field">
                <div className="label">Experience (years)</div>
                <input className="input" inputMode="numeric" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="0" />
              </div>
            )}

            <div className="field">
              <div className="label">Email</div>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="field">
              <div className="label">Password</div>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 chars, upper/lower/number/special" />
            </div>

            {!isRecruiter ? (
              <>
                <div className="field">
                  <div className="label">Skills</div>
                  <input className="input" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Java, Spring, React" />
                </div>
                <div className="field">
                  <div className="label">Location</div>
                  <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Kolkata" />
                </div>
              </>
            ) : null}

            <div className="row" style={{ gridColumn: '1 / -1', justifyContent: 'space-between' }}>
              <button className="btn btnPrimary" disabled={loading} type="submit">
                {loading ? 'Creating…' : 'Register'}
              </button>
              <Link className="btn" to="/login">
                Already have an account?
              </Link>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <FormErrorAlert error={err} fallback="Registration failed" />
            </div>
            {ok ? <div className="success" style={{ gridColumn: '1 / -1' }}>{ok}</div> : null}
          </form>
        </div>
      </div>
    </div>
  )
}

