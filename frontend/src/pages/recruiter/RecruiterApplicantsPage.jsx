import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError } from '../../shared/api/apiClient.js'
import { applicants } from '../../shared/api/jobApi.js'
import { downloadResume } from '../../shared/api/candidateApi.js'
import { formatInstant } from '../../shared/utils/format.js'
import { Card, CardBody, CardHeader, Badge, Button, SkeletonLoader } from '../../components'
import { ArrowLeft,Code2, Users, Briefcase, Mail, MapPin, CalendarDays, AlertCircle, Download } from 'lucide-react'

export function RecruiterApplicantsPage() {
  const { jobId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [downloading, setDownloading] = useState(null)

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

  const handleDownloadResume = async (candidateId, candidateName) => {
    setDownloading(candidateId)
    try {
      const blob = await downloadResume(jobId, candidateId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${candidateName.replace(/\s+/g, '_')}_resume.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Failed to download resume')
    } finally {
      setDownloading(null)
    }
  }

  const rows = data?.applications || []

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900">
              <Users className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Applicants</h1>
              <p className="text-gray-600 dark:text-gray-400">Review candidates who applied for this job.</p>
            </div>
          </div>
          {data?.title && (
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Briefcase size={16} />
              <span>{data.title}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/recruiter/jobs">
            <Button variant="outline" size="md" className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Back
            </Button>
          </Link>
          <Link to={`/jobs/${jobId}`}>
            <Button variant="primary" size="md">Job details</Button>
          </Link>
          <Link to={`/recruiter/jobs/${jobId}/applicants-analyze`}>
            <Button variant="primary" size="md">AI Analysis</Button>
          </Link>
        </div>
      </div>

      {err && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 dark:bg-red-900/20 dark:border-red-800">
          <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
          <div>
            <p className="font-semibold text-red-900 dark:text-red-100">Unable to load applicants</p>
            <p className="text-sm text-red-700 mt-1 dark:text-red-300">{err}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx}>
              <CardBody className="space-y-4">
                <SkeletonLoader className="h-6 w-1/2" />
                <SkeletonLoader className="h-4 w-full" />
                <SkeletonLoader className="h-4 w-full" />
              </CardBody>
            </Card>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <CardBody className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-blue-100 mx-auto mb-4 dark:bg-blue-900">
              <Users className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">No applications yet</p>
            <p className="text-gray-600 mt-2 dark:text-gray-400">Once candidates apply, they will appear here.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="grid grid-cols-2 gap-4 px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wide dark:text-gray-400">
              <div>Candidate</div>
              <div className="grid grid-cols-4 gap-4">
                <span>Skills</span>
                <span>Experience</span>
                <span>Location</span>
                <span>Applied</span>
              </div>
            </CardHeader>
          </Card>

          {rows.map((application) => (
            <Card key={application.id} className="card-hover">
              <CardBody className="grid gap-4 md:grid-cols-3 items-center">
                <div className="space-y-2">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{application.candidate?.name}</div>
                  <div className="text-sm text-gray-600 flex flex-wrap gap-2 items-center dark:text-gray-400">
                    <Mail size={14} />
                    <span>{application.candidate?.email}</span>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="inline-flex items-center gap-2">
                    <Code2 size={16} />
                    <span>{application.candidate?.skills || '—'}</span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Briefcase size={16} />
                    <span>{application.candidate?.experience} yrs</span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{application.candidate?.location || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="inline-flex items-center gap-2">
                      <CalendarDays size={16} />
                      <span>{formatInstant(application.appliedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                  <Link to={`/recruiter/candidates/${application.candidate?.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      View profile
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadResume(application.candidate?.id, application.candidate?.name)}
                    disabled={downloading === application.candidate?.id}
                    className="flex items-center gap-2"
                  >
                    {downloading === application.candidate?.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Resume
                      </>
                    )}
                  </Button>
                </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

