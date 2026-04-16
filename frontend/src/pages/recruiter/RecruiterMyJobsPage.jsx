import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../../shared/api/apiClient.js'
import { myJobs } from '../../shared/api/jobApi.js'

export function RecruiterMyJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    let alive = true
    const run = async () => {
      setLoading(true)
      setErr('')
      try {
        const res = await myJobs()
        if (alive) setJobs(Array.isArray(res) ? res : [])
      } catch (e) {
        if (alive) setErr(e instanceof ApiError ? e.message : 'Failed to load jobs')
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="card">
        <div className="cardBody">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <h1 className="title">My jobs</h1>
              <p className="subtitle">Manage and track all your job postings.</p>
            </div>
            <Link className="btn btnPrimary" to="/recruiter/jobs/new">
              Post new job
            </Link>
          </div>
        </div>
      </div>

      {err ? <div className="error">{err}</div> : null}

      <div className="grid" style={{ gap: 12 }}>
        {loading ? (
          <div className="card">
            <div className="cardBody muted">Loading…</div>
          </div>
        ) : null}

        {!loading && jobs.length === 0 ? (
          <div className="card">
            <div className="cardBody muted">No jobs posted yet.</div>
          </div>
        ) : null}

        {jobs.map((j) => (
          <div key={j.id} className="card">
            <div className="cardBody grid">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{j.title}</div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                    {j.location} • {j.experienceRequired} yrs • Skills: {j.requiredSkills}
                  </div>
                </div>
                <div className="row">
                  <Link className="btn" to={`/jobs/${j.id}`}>
                    Details
                  </Link>
                  <Link className="btn" to={`/recruiter/jobs/${j.id}/applicants`}>
                    Applicants
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

