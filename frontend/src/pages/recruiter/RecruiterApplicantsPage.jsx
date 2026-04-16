import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError } from '../../shared/api/apiClient.js'
import { applicants } from '../../shared/api/jobApi.js'
import { formatInstant } from '../../shared/utils/format.js'

export function RecruiterApplicantsPage() {
  const { jobId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    let alive = true
    const run = async () => {
      setLoading(true)
      setErr('')
      try {
        const res = await applicants(jobId)
        if (alive) setData(res)
      } catch (e) {
        if (alive) setErr(e instanceof ApiError ? e.message : 'Failed to load applicants')
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [jobId])

  const rows = data?.applications || []

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Link className="btn" to="/recruiter/jobs">
          ← Back
        </Link>
        <Link className="btn" to={`/jobs/${jobId}`}>
          Job details
        </Link>
      </div>

      <div className="card">
        <div className="cardBody">
          <h1 className="title">Applicants</h1>
          <p className="subtitle">Review all candidates who applied for this position.</p>
        </div>
      </div>

      {err ? <div className="error">{err}</div> : null}

      <div className="card">
        <div className="cardBody">
          {loading ? (
            <div className="muted">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="muted">No applications yet.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Skills</th>
                  <th>Experience</th>
                  <th>Location</th>
                  <th>Applied at</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{a.candidate?.name}</div>
                      <div className="muted" style={{ fontSize: 13 }}>
                        {a.candidate?.email}
                      </div>
                    </td>
                    <td>{a.candidate?.skills}</td>
                    <td>{a.candidate?.experience} yrs</td>
                    <td>{a.candidate?.location}</td>
                    <td>{formatInstant(a.appliedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

