import { Link } from 'react-router-dom'
import { useAuth } from '../shared/auth/AuthProvider.jsx'

export function LandingPage() {
  const auth = useAuth()

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="card">
        <div className="cardBody">
          <div className="grid" style={{ gap: 10 }}>
            <div>
              <h1 className="title" style={{ fontSize: 34 }}>
                Hire faster. Apply smarter.
              </h1>
              <p className="subtitle">
                A secure job portal with JWT auth, role-based access, and a clean workflow for recruiters and candidates.
              </p>
            </div>

            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="row">
                <Link className="btn btnPrimary" to="/jobs">
                  Browse jobs
                </Link>
                {!auth.isAuthed ? (
                  <>
                    <Link className="btn" to="/login">
                      Login
                    </Link>
                    <Link className="btn" to="/register">
                      Register
                    </Link>
                  </>
                ) : null}
              </div>

              {auth.isAuthed ? <span className="pill">Welcome back!</span> : null}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid2">
        <div className="card">
          <div className="cardBody">
            <div style={{ fontWeight: 800, marginBottom: 6 }}>For candidates</div>
            <div className="muted" style={{ marginBottom: 12 }}>
              Search jobs by skills and location, view details, and apply in one click.
            </div>
            <div className="row">
              <span className="pill">Smart Search</span>
              <span className="pill">Easy Profile</span>
              <span className="pill">Quick Apply</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardBody">
            <div style={{ fontWeight: 800, marginBottom: 6 }}>For recruiters</div>
            <div className="muted" style={{ marginBottom: 12 }}>
              Post jobs, track your postings, and review applicants instantly.
            </div>
            <div className="row">
              <span className="pill">Post Instantly</span>
              <span className="pill">Manage Postings</span>
              <span className="pill">Review Candidates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardBody">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 800 }}>Quick start</div>
              <div className="muted" style={{ marginTop: 4 }}>
                Start with jobs browsing, then login/register to unlock role-specific features.
              </div>
            </div>
            <Link className="btn" to="/jobs">
              Go to jobs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

