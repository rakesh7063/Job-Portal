import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listJobs, searchJobs } from '../shared/api/jobApi.js'
import { ApiError } from '../shared/api/apiClient.js'

function JobCard({ job }) {
  return (
    <div className="card">
      <div className="cardBody grid">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{job.title}</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
              {job.location} • {job.experienceRequired} yrs • {job.postedBy?.company}
            </div>
          </div>
          <Link className="btn" to={`/jobs/${job.id}`}>
            View
          </Link>
        </div>
        <div className="row">
          <span className="pill">Skills: {job.requiredSkills}</span>
        </div>
      </div>
    </div>
  )
}

export function JobsPage() {
  const [skill, setSkill] = useState('')
  const [skills, setSkills] = useState('')
  const [location, setLocation] = useState('')

  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const isSearching = useMemo(() => {
    return Boolean((skills && skills.trim()) || (skill && skill.trim()) || (location && location.trim()))
  }, [skills, skill, location])

  const load = async (nextPage) => {
    setLoading(true)
    setErr('')
    try {
      const payload = { page: nextPage, size }
      const res = isSearching
        ? await searchJobs({
            ...payload,
            skills: skills.trim() || undefined,
            skill: skill.trim() || undefined,
            location: location.trim() || undefined,
          })
        : await listJobs(payload)
      setData(res)
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Failed to load jobs'
      setErr(msg)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const onSearch = (e) => {
    e.preventDefault()
    setPage(0)
    load(0)
  }

  const content = data?.content || []
  const totalPages = typeof data?.totalPages === 'number' ? data.totalPages : 1

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="card">
        <div className="cardBody">
          <div>
            <h1 className="title">Browse jobs</h1>
            <p className="subtitle">Search by skill(s) and location.</p>
          </div>

          <form className="grid grid2" onSubmit={onSearch} style={{ marginTop: 14 }}>
            <div className="field">
              <div className="label">Skills (comma separated)</div>
              <input className="input" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Java, Spring, React" />
            </div>
            <div className="field">
              <div className="label">Specific Skill</div>
              <input className="input" value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Java" />
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <div className="label">Location</div>
              <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Kolkata" />
            </div>
            <div className="row" style={{ gridColumn: '1 / -1', justifyContent: 'space-between' }}>
              <button className="btn btnPrimary" disabled={loading} type="submit">
                {loading ? 'Searching…' : 'Search'}
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setSkills('')
                  setSkill('')
                  setLocation('')
                  setPage(0)
                  load(0)
                }}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </form>

          {err ? <div className="error" style={{ marginTop: 12 }}>{err}</div> : null}
        </div>
      </div>

      <div className="pagination">
        <div className="muted">
          Page {page + 1} of {totalPages}
        </div>
        <div className="row">
          <button className="btn" disabled={loading || page <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
            Prev
          </button>
          <button className="btn" disabled={loading || page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </div>

      <div className="grid" style={{ gap: 12 }}>
        {loading && !data ? (
          <div className="card">
            <div className="cardBody muted">Loading jobs…</div>
          </div>
        ) : null}
        {!loading && content.length === 0 ? (
          <div className="card">
            <div className="cardBody muted">No jobs found.</div>
          </div>
        ) : null}
        {content.map((j) => (
          <JobCard key={j.id} job={j} />
        ))}
      </div>
    </div>
  )
}

