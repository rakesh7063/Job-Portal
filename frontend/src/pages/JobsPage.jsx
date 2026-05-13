import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listJobs, searchJobs } from '../shared/api/jobApi.js'
import { ApiError } from '../shared/api/apiClient.js'
import { Button, Card, CardBody, Badge, Input, FormGroup, LoadingSpinner, SkeletonLoader } from '../components'
import { MapPin, Briefcase, TrendingUp, ArrowRight, Search } from 'lucide-react'

function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job.id}`}>
      <Card className="card-hover h-full transition-all duration-300">
        <CardBody className="flex flex-col justify-between h-full">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1 dark:text-gray-400">
                  <Briefcase size={14} />
                  <span>{job.postedBy?.company || 'Company'}</span>
                </div>
              </div>
              <ArrowRight size={20} className="text-gray-400 flex-shrink-0 mt-1 dark:text-gray-500" />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin size={16} className="flex-shrink-0" />
              <span>{job.location}</span>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <TrendingUp size={16} className="flex-shrink-0" />
              <span>{job.experienceRequired} yrs</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.requiredSkills && job.requiredSkills.split(',').slice(0, 3).map((skill, idx) => (
                <Badge key={idx} variant="primary" className="text-xs">
                  {skill.trim()}
                </Badge>
              ))}
              {job.requiredSkills && job.requiredSkills.split(',').length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{job.requiredSkills.split(',').length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
            <Button variant="primary" size="sm" className="w-full">
              View Details →
            </Button>
          </div>
        </CardBody>
      </Card>
    </Link>
  )
}

function JobCardSkeleton() {
  return (
    <Card>
      <CardBody className="space-y-4">
        <SkeletonLoader className="h-6 w-3/4" />
        <SkeletonLoader className="h-4 w-1/2" />
        <div className="flex gap-2">
          <SkeletonLoader className="h-6 w-20" />
          <SkeletonLoader className="h-6 w-20" />
        </div>
      </CardBody>
    </Card>
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
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Browse Opportunities</h1>
        <p className="text-lg text-gray-600">
          Discover job openings that match your skills and preferences.
        </p>
      </div>

      {/* Search Card */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 dark:border-blue-900/40 dark:from-slate-950 dark:to-slate-900">
        <CardBody className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Search size={20} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Search Jobs</h2>
          </div>

          <form onSubmit={onSearch} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormGroup
                label="Skills (comma separated)"
                helperText="e.g., Java, Spring, React"
              >
                <Input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Java, Spring, React"
                  disabled={loading}
                />
              </FormGroup>

              <FormGroup
                label="Specific Skill"
                helperText="Search for a specific skill"
              >
                <Input
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="e.g., Java"
                  disabled={loading}
                />
              </FormGroup>
            </div>

            <FormGroup label="Location">
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Kolkata, Mumbai, Remote"
                disabled={loading}
              />
            </FormGroup>

            {err && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                {err}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="!border-white !border-t-blue-600" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Search Jobs
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                disabled={loading}
                onClick={() => {
                  setSkills('')
                  setSkill('')
                  setLocation('')
                  setPage(0)
                  load(0)
                }}
              >
                Clear Filters
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Results Info */}
      {data && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 dark:bg-blue-900/20 dark:border-blue-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing page <span className="font-semibold">{page + 1}</span> of{' '}
            <span className="font-semibold">{totalPages}</span>
            {isSearching && ' (filtered results)'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {content.length} jobs displayed
          </p>
        </div>
      )}

      {/* Job Listings */}
      <div>
        {loading && !data ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : !loading && content.length === 0 ? (
          <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
            <CardBody className="py-12 text-center">
              <Search size={48} className="mx-auto text-gray-400 mb-4 dark:text-gray-400" />
              <p className="text-lg text-gray-600 dark:text-gray-200 font-medium">No jobs found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Try adjusting your search filters to find more opportunities.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {content.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {content.length > 0 && (
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-900 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Page <span className="font-semibold">{page + 1}</span> of{' '}
            <span className="font-semibold">{totalPages}</span>
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="md"
              disabled={loading || page <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="md"
              disabled={loading || page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

