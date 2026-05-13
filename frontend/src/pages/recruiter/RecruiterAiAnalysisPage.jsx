import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApiError } from '../../shared/api/apiClient.js'
import { analyzeJobApplicants,analyzeCandidateForJob, getApplicantSummaries } from '../../shared/api/candidateApi.js'
import { FormErrorAlert } from '../../shared/ui/FormErrorAlert.jsx'

export function RecruiterAiAnalysisPage() {
  const { jobId } = useParams()
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [applicants, setApplicants] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [err, setErr] = useState(null)
  const [expandedCandidateId, setExpandedCandidateId] = useState(null)

  // Load applicants
  useEffect(() => {
    let alive = true
    const run = async () => {
      setLoading(true)
      setErr('')
      try {
        const res = await getApplicantSummaries(jobId)
        if (alive) setApplicants(res)
      } catch (e) {
        if (alive) setErr(e instanceof ApiError ? e : new Error('Failed to load applicants'))
      } finally {
        if (alive) setLoading(false)
      }
    }
    if (jobId) run()
    return () => {
      alive = false
    }
  }, [jobId])

  const runAiAnalysis = async () => {
    setAnalyzing(true)
    setErr('')
    try {
      const res = await analyzeJobApplicants(jobId)
      setAnalysis(res)
    } catch (e) {
      setErr(e instanceof ApiError ? e : new Error('AI analysis failed'))
    } finally {
      setAnalyzing(false)
    }
  }

  const runIndividualAnalysis = async (candidateId) => {
    setErr('')
    try {
      const res = await analyzeCandidateForJob(jobId, candidateId)
      // Update analysis with this candidate's result
      setAnalysis(prev => ({
        ...prev,
        topCandidates: prev?.topCandidates?.map(c =>
          c.candidateId === candidateId ? res : c
        ) || [res]
      }))
      setExpandedCandidateId(candidateId)
    } catch (e) {
      setErr(e instanceof ApiError ? e : new Error('Failed to analyze candidate'))
    }
  }

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="card">
        <div className="cardBody">
          <h1 className="title">🤖 AI Candidate Analysis</h1>
          <p className="subtitle">Using Gemini AI to match candidates with your job requirements - Top 5 ranked by match score</p>
        </div>
      </div>

      <FormErrorAlert error={err} fallback="Request failed" />

      <div className="card">
        <div className="cardBody">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>Applicants ({applicants.length})</h2>
            <button
              className="btn btnPrimary"
              onClick={runAiAnalysis}
              disabled={analyzing || applicants.length === 0}
            >
              {analyzing ? '🔄 Analyzing...' : '🚀 Run AI Analysis'}
            </button>
          </div>

          {loading ? (
            <div className="muted">Loading applicants...</div>
          ) : applicants.length === 0 ? (
            <div className="muted">No applicants yet</div>
          ) : (
            <div>
              {analysis ? (
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ marginTop: 0, marginBottom: 12, color: 'var(--primary)' }}>Top 5 Candidates</h3>
                  <div className="grid" style={{ gap: 12 }}>
                    {analysis.topCandidates?.map((candidate, idx) => (
                      <div
                        key={candidate.candidateId}
                        className="card"
                        style={{
                          borderLeft: `4px solid ${
                            candidate.matchScore >= 80 ? 'var(--primary2)' :
                            candidate.matchScore >= 60 ? '#ff9800' : 'var(--danger)'
                          }`
                        }}
                      >
                        <div className="cardBody">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <span style={{ fontSize: 20, fontWeight: 'bold' }}>#{idx + 1}</span>
                                <span style={{ fontSize: 16, fontWeight: 500 }}>{candidate.candidateName}</span>
                              </div>
                              <div className="row" style={{ gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                                <span className="pill">{candidate.recommendation}</span>
                                <span className="pill">Experience: {candidate.experience}y</span>
                                <span className="pill">Location: {candidate.location || 'N/A'}</span>
                              </div>
                            </div>
                            <div
                              style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                              color: candidate.matchScore >= 80 ? 'var(--primary2)' :
                                     candidate.matchScore >= 60 ? '#ff9800' : 'var(--danger)',
                                minWidth: 60,
                                textAlign: 'center'
                              }}
                            >
                              {candidate.matchScore}%
                            </div>
                          </div>

                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                            <p style={{ marginTop: 0 }}><strong>Analysis:</strong></p>
                            <p style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{candidate.summary}</p>
                          </div>

                          <button
                            className="btn btnSecondary"
                            onClick={() =>
                              expandedCandidateId === candidate.candidateId
                                ? setExpandedCandidateId(null)
                                : runIndividualAnalysis(candidate.candidateId)
                            }
                            style={{ marginTop: 12 }}
                          >
                            {expandedCandidateId === candidate.candidateId ? '▼ Hide Details' : '▶ View Details'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <h3 style={{ marginTop: analysis ? 20 : 0, marginBottom: 12 }}>All Applicants</h3>
              <div className="grid" style={{ gap: 8 }}>
                {applicants.map(applicant => (
                  <div key={applicant.candidateId} className="row" style={{ padding: 12, backgroundColor: 'var(--surface)', borderRadius: 4 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>{applicant.candidateName}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{applicant.email}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                        {applicant.experience}y exp • {applicant.location || 'N/A'} • Skills: {applicant.skills || 'N/A'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {applicant.hasResume && (
                        <span className="pill" style={{ backgroundColor: 'var(--primary2)', color: 'white', fontSize: 12 }}>
                          ✓ Resume
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
