import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ApiError } from '../shared/api/apiClient.js'
import { applyToJob, getJob } from '../shared/api/jobApi.js'
import { useAuth } from '../shared/auth/AuthProvider.jsx'
import { Button, Card, CardBody, Badge, SkeletonLoader } from '../components'
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  TrendingUp,
  Building2,
  User,
  Zap,
  CheckCircle,
  AlertCircle,
  Send,
} from 'lucide-react'

export function JobDetailsPage() {
  const { id } = useParams()
  const auth = useAuth()
  const nav = useNavigate()
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
      setMsg(typeof res === 'string' ? res : 'Applied successfully! Check your email for confirmation.')
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with Back Button and Apply Button */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          <ArrowLeft size={18} />
          Back to Jobs
        </Link>

        {canApply ? (
          <Button
            onClick={onApply}
            disabled={applying || loading}
            variant="primary"
            size="lg"
            className="flex items-center gap-2"
          >
            {applying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <Send size={18} />
                Apply Now
              </>
            )}
          </Button>
        ) : (
          <Badge
            variant={auth.isAuthed ? 'warning' : 'info'}
            className="px-4 py-2"
          >
            {auth.isAuthed ? '🔒 Candidates Only' : '📧 Login to Apply'}
          </Badge>
        )}
      </div>

      {/* Status Messages */}
      {err && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 dark:bg-red-900/20 dark:border-red-800">
          <AlertCircle className="text-red-600 flex-shrink-0 dark:text-red-400" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-100">Error</h3>
            <p className="text-sm text-red-700 mt-1 dark:text-red-300">{err}</p>
          </div>
        </div>
      )}

      {msg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3 animate-fade-in dark:bg-green-900/20 dark:border-green-800">
          <CheckCircle className="text-green-600 flex-shrink-0 dark:text-green-400" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 dark:text-green-100">Success!</h3>
            <p className="text-sm text-green-700 mt-1 dark:text-green-300">{msg}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="space-y-4">
          <SkeletonLoader className="h-12 w-3/4" />
          <SkeletonLoader className="h-6 w-1/2" />
          <div className="grid grid-cols-4 gap-4">
            <SkeletonLoader className="h-24" />
            <SkeletonLoader className="h-24" />
            <SkeletonLoader className="h-24" />
            <SkeletonLoader className="h-24" />
          </div>
          <SkeletonLoader className="h-64" />
        </div>
      ) : job ? (
        <div className="space-y-6">
          {/* Job Header */}
          <Card className="border-0 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <CardBody className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{job.title}</h1>
              <p className="text-gray-600 text-lg dark:text-gray-400">
                Posted by <span className="font-semibold">{job.postedBy?.company}</span> •{' '}
                <span className="text-gray-500 dark:text-gray-500">{job.postedBy?.name}</span>
              </p>
            </CardBody>
          </Card>

          {/* Key Info Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardBody className="space-y-2">
                <MapPin className="text-blue-600 mx-auto" size={24} />
                <div className="font-semibold text-gray-900">{job.location}</div>
                <div className="text-xs text-gray-500">Location</div>
              </CardBody>
            </Card>

            <Card className="text-center">
              <CardBody className="space-y-2">
                <TrendingUp className="text-green-600 mx-auto" size={24} />
                <div className="font-semibold text-gray-900">{job.experienceRequired} Years</div>
                <div className="text-xs text-gray-500">Experience</div>
              </CardBody>
            </Card>

            <Card className="text-center">
              <CardBody className="space-y-2">
                <Building2 className="text-purple-600 mx-auto" size={24} />
                <div className="font-semibold text-gray-900">{job.postedBy?.company}</div>
                <div className="text-xs text-gray-500">Company</div>
              </CardBody>
            </Card>

            <Card className="text-center">
              <CardBody className="space-y-2">
                <Zap className="text-yellow-600 mx-auto" size={24} />
                <div className="font-semibold text-gray-900">Active</div>
                <div className="text-xs text-gray-500">Status</div>
              </CardBody>
            </Card>
          </div>

          {/* Required Skills */}
          <Card>
            <CardBody className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase size={20} className="text-blue-600" />
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills &&
                  job.requiredSkills
                    .split(',')
                    .map((skill, idx) => (
                      <Badge key={idx} variant="primary">
                        {skill.trim()}
                      </Badge>
                    ))}
              </div>
            </CardBody>
          </Card>

          {/* Job Description */}
          <Card>
            <CardBody className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase size={20} className="text-blue-600" />
                Job Description
              </h3>
              <div className="prose prose-sm max-w-none">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 whitespace-pre-wrap text-gray-700 font-mono text-sm leading-relaxed dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300">
                  {job.description}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Recruiter Info */}
          <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
            <CardBody className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-200 rounded-lg dark:bg-blue-800">
                  <User className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Posted by</h4>
                  <p className="text-gray-600 mt-1">
                    {job.postedBy?.name} at {job.postedBy?.company}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* CTA */}
          {canApply && (
            <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
              <CardBody className="text-center space-y-4 py-8">
                <h3 className="text-2xl font-bold">Ready to Apply?</h3>
                <p className="text-blue-100">Click the button below to submit your application</p>
                <Button
                  onClick={onApply}
                  disabled={applying}
                  variant="secondary"
                  size="lg"
                  className="mx-auto flex items-center gap-2"
                >
                  {applying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Apply for This Job
                    </>
                  )}
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-lg text-gray-600 font-medium">Job Not Found</p>
            <p className="text-sm text-gray-500 mt-2">The job you're looking for doesn't exist or has been removed.</p>
            <Link to="/jobs" className="inline-block mt-6">
              <Button variant="primary">
                Browse Other Jobs
              </Button>
            </Link>
          </CardBody>
        </Card>
      )}
    </div>
  )
}

