import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError } from '../shared/api/apiClient.js'
import { applyToJob, getJob } from '../shared/api/jobApi.js'
import { useAuth } from '../shared/auth/AuthProvider.jsx'

export function JobDetailsPage() {
  const { id } = useParams()
  const auth = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    let alive = true
    const run = async () => {
      setLoading(true)
      setErr('')
      try {
        const res = await getJob(id)
        if (alive) setJob(res)
      } catch (e) {
        if (alive) setErr(e instanceof ApiError ? e.message : 'Failed to load job')
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [id])

  const canApply = auth.isAuthed && auth.role === 'ROLE_CANDIDATE'

  const onApply = async () => {
    setApplying(true)
    setErr('')
    setMsg('')
    try {
      const res = await applyToJob(id)
      setMsg(typeof res === 'string' ? res : 'Applied successfully.')
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Link className="btn" to="/">
          ← Back to jobs
        </Link>
        {canApply ? (
          <button className="btn btnPrimary" onClick={onApply} disabled={applying || loading}>
            {applying ? 'Applying…' : 'Apply'}
          </button>
        ) : (
          <span className="pill">
            {auth.isAuthed ? 'Only candidates can apply' : 'Login as candidate to apply'}
          </span>
        )}
      </div>

      {err ? <div className="error">{err}</div> : null}
      {msg ? <div className="success">{msg}</div> : null}

      <div className="card">
        <div className="cardBody">
          {loading ? (
            <div className="muted">Loading…</div>
          ) : job ? (
            <div className="grid" style={{ gap: 10 }}>
              <div>
                <h1 className="title" style={{ marginBottom: 4 }}>
                  {job.title}
                </h1>
                <p className="subtitle">
                  {job.location} • {job.experienceRequired} yrs • {job.postedBy?.company} ({job.postedBy?.name})
                </p>
              </div>

              <div className="row">
                <span className="pill">Required skills: {job.requiredSkills}</span>
              </div>

              <div className="card" style={{ boxShadow: 'none' }}>
                <div className="cardBody">
                  <div className="label">Description</div>
                  <div style={{ whiteSpace: 'pre-wrap', marginTop: 6, color: 'var(--muted)' }}>{job.description}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="muted">Job not found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

