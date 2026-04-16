import { useEffect, useState } from 'react'
import { ApiError } from '../../shared/api/apiClient.js'
import { getCandidateProfile, updateCandidateProfile } from '../../shared/api/candidateApi.js'
import { useAuth } from '../../shared/auth/AuthProvider.jsx'
import { FormErrorAlert } from '../../shared/ui/FormErrorAlert.jsx'

export function CandidateProfilePage() {
  const auth = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ name: '', experience: '0', skills: '', location: '' })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState(null)
  const [ok, setOk] = useState('')

  useEffect(() => {
    let alive = true
    const run = async () => {
      setLoading(true)
      setErr('')
      try {
        const res = await getCandidateProfile()
        if (!alive) return
        setProfile(res)
        if (res?.name) {
          auth.setAuth({ token: auth.token, role: auth.role, name: res.name, email: res.email || auth.email })
        }
        setForm({
          name: res.name || '',
          experience: String(res.experience ?? 0),
          skills: res.skills || '',
          location: res.location || '',
        })
      } catch (e) {
        if (alive) setErr(e instanceof ApiError ? e : new Error('Failed to load profile'))
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [])

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErr('')
    setOk('')
    try {
      const payload = {
        name: form.name,
        experience: Number(form.experience || 0),
        skills: form.skills,
        location: form.location,
      }
      const res = await updateCandidateProfile(payload)
      setProfile(res)
      if (res?.name) {
        auth.setAuth({ token: auth.token, role: auth.role, name: res.name, email: res.email || auth.email })
      }
      setOk('Profile updated.')
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2 : new Error('Failed to update profile'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="card">
        <div className="cardBody">
          <h1 className="title">Your Profile</h1>
          <p className="subtitle">Update your profile to help recruiters find the perfect match for you.</p>
        </div>
      </div>

      <FormErrorAlert error={err} fallback="Request failed" />
      {ok ? <div className="success">{ok}</div> : null}

      <div className="card">
        <div className="cardBody">
          {loading ? (
            <div className="muted">Loading…</div>
          ) : profile ? (
            <div className="grid" style={{ gap: 12 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="pill">Email: {profile.email}</span>
                <span className="pill">ID: {profile.id}</span>
              </div>

              <form className="grid grid2" onSubmit={onSave}>
                <div className="field">
                  <div className="label">Name</div>
                  <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="field">
                  <div className="label">Experience (years)</div>
                  <input className="input" inputMode="numeric" value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} />
                </div>
                <div className="field">
                  <div className="label">Skills</div>
                  <input className="input" value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} />
                </div>
                <div className="field">
                  <div className="label">Location</div>
                  <input className="input" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
                </div>

                <div className="row" style={{ gridColumn: '1 / -1', justifyContent: 'flex-end' }}>
                  <button className="btn btnPrimary" type="submit" disabled={saving}>
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="muted">No profile data.</div>
          )}
        </div>
      </div>
    </div>
  )
}

