import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../../shared/api/apiClient.js'
import { myJobs } from '../../shared/api/jobApi.js'
import { Button, Card, CardBody, Badge, SkeletonLoader } from '../../components'
import { Briefcase, MapPin, TrendingUp, Plus, Users, Eye, ArrowRight, AlertCircle } from 'lucide-react'

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 dark:text-gray-100">
            <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/20">
              <Briefcase className="text-blue-600" size={28} />
            </div>
            My Job Postings
          </h1>
          <p className="text-lg text-gray-600">
            Manage and track all your job postings in one place
          </p>
        </div>

        <Link to="/recruiter/jobs/new">
          <Button variant="primary" size="lg" className="flex items-center gap-2 whitespace-nowrap">
            <Plus size={18} />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Error Alert */}
      {err && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 dark:bg-red-900/20 dark:border-red-800">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-200">Error</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{err}</p>
          </div>
        </div>
      )}

      {/* Statistics */}
      {!loading && jobs.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardBody className="py-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">{jobs.length}</div>
              <div className="text-sm text-gray-600">Active Postings</div>
            </CardBody>
          </Card>

          <Card className="text-center">
            <CardBody className="py-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </CardBody>
          </Card>

          <Card className="text-center">
            <CardBody className="py-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.max(...jobs.map((j) => j.applicantCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Most Applications</div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Jobs List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardBody className="space-y-4">
                <SkeletonLoader className="h-6 w-1/2" />
                <SkeletonLoader className="h-4 w-full" />
                <div className="flex gap-3">
                  <SkeletonLoader className="h-8 w-24" />
                  <SkeletonLoader className="h-8 w-24" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <CardBody className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-blue-100 dark:bg-blue-800 mb-4">
              <Briefcase className="text-blue-600" size={32} />
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4">No jobs posted yet</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Start by creating your first job posting</p>
            <Link to="/recruiter/jobs/new" className="inline-block mt-6">
              <Button variant="primary">Post Your First Job</Button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {jobs.map((j) => (
            <Link key={j.id} to={`/jobs/${j.id}`}>
              <Card className="card-hover">
                <CardBody className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 line-clamp-1">
                        {j.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-2">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="flex-shrink-0" />
                          <span>{j.location}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp size={14} className="flex-shrink-0" />
                          <span>{j.experienceRequired} yrs</span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {j.requiredSkills &&
                          j.requiredSkills
                            .split(',')
                            .slice(0, 3)
                            .map((skill, idx) => (
                              <Badge key={idx} variant="primary" className="text-xs">
                                {skill.trim()}
                              </Badge>
                            ))}
                        {j.requiredSkills && j.requiredSkills.split(',').length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{j.requiredSkills.split(',').length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="flex flex-col gap-3 items-end">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <Users size={18} />
                        <span>{j.applicantCount || 0}</span>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/jobs/${j.id}`}
                          className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Eye size={18} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200" />
                        </Link>

                        <Link
                          to={`/recruiter/jobs/${j.id}/applicants`}
                          className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ArrowRight size={18} className="text-blue-600 hover:text-blue-700 dark:hover:text-blue-300" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

