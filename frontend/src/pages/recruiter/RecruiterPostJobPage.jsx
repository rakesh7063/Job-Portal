import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../../shared/api/apiClient.js'
import { createJob } from '../../shared/api/jobApi.js'
import { FormErrorAlert } from '../../shared/ui/FormErrorAlert.jsx'

export function RecruiterPostJobPage() {
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requiredSkills, setRequiredSkills] = useState('')
  const [experienceRequired, setExperienceRequired] = useState('0')
  const [location, setLocation] = useState('')

  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [ok, setOk] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    setOk('')
    try {
      const res = await createJob({
        title,
        description,
        requiredSkills,
        experienceRequired: Number(experienceRequired || 0),
        location,
      })
      setOk('Job posted.')
      setTimeout(() => nav(`/jobs/${res.id}`, { replace: true }), 400)
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2 : new Error('Failed to post job'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="card">
        <div className="cardBody">
          <h1 className="title">Post a new job</h1>
          <p className="subtitle">Create and publish a job listing to reach qualified candidates.</p>
        </div>
      </div>

      <FormErrorAlert error={err} fallback="Failed to post job" />
      {ok ? <div className="success">{ok}</div> : null}

      <div className="card">
        <div className="cardBody">
          <form className="grid grid2" onSubmit={onSubmit}>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <div className="label">Title</div>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Backend Developer" />
            </div>
            <div className="field">
              <div className="label">Required skills</div>
              <input className="input" value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} placeholder="Java, Spring Boot" />
            </div>
            <div className="field">
              <div className="label">Experience required (years)</div>
              <input className="input" inputMode="numeric" value={experienceRequired} onChange={(e) => setExperienceRequired(e.target.value)} placeholder="0" />
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <div className="label">Location</div>
              <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Kolkata" />
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <div className="label">Description</div>
              <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Role responsibilities, requirements, etc." />
            </div>

            <div className="row" style={{ gridColumn: '1 / -1', justifyContent: 'flex-end' }}>
              <button className="btn btnPrimary" disabled={loading} type="submit">
                {loading ? 'Posting…' : 'Post job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

