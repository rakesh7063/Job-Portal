import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../../shared/api/apiClient.js'
import { createJob } from '../../shared/api/jobApi.js'
import { Button, Card, CardBody, CardHeader, FormGroup, Input } from '../../components'
import { Briefcase, MapPin, Code2, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

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
      setOk('Job posted successfully! Redirecting...')
      setTimeout(() => nav(`/jobs/${res.id}`, { replace: true }), 700)
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2 : new Error('Failed to post job'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Post a New Job</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Create and publish a job listing to attract qualified candidates.</p>
      </div>

      {err && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 dark:bg-red-900/20 dark:border-red-800">
          <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
          <div>
            <p className="font-semibold text-red-900 dark:text-red-100">Unable to post job</p>
            <p className="text-sm text-red-700 mt-1 dark:text-red-300">{err?.message || 'Please review the information and try again.'}</p>
          </div>
        </div>
      )}

      {ok && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3 animate-fade-in dark:bg-green-900/20 dark:border-green-800">
          <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
          <div>
            <p className="font-semibold text-green-900 dark:text-green-100">Success</p>
            <p className="text-sm text-green-700 mt-1 dark:text-green-300">{ok}</p>
          </div>
        </div>
      )}

      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Briefcase className="text-blue-600 dark:text-blue-400" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Job details</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Share the role, required skills, location, and description.</p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="space-y-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <FormGroup label="Job Title" required>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  className="pl-10"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Backend Developer"
                  disabled={loading}
                  required
                />
              </div>
            </FormGroup>

            <div className="grid md:grid-cols-2 gap-6">
              <FormGroup label="Required Skills" helperText="Comma separated values">
                <div className="relative">
                  <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    className="pl-10"
                    value={requiredSkills}
                    onChange={(e) => setRequiredSkills(e.target.value)}
                    placeholder="Java, Spring Boot, React"
                    disabled={loading}
                  />
                </div>
              </FormGroup>

              <FormGroup label="Experience Required" helperText="Years of experience">
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    className="pl-10"
                    value={experienceRequired}
                    onChange={(e) => setExperienceRequired(e.target.value)}
                    placeholder="0"
                    disabled={loading}
                  />
                </div>
              </FormGroup>
            </div>

            <FormGroup label="Location" required>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  className="pl-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Kolkata"
                  disabled={loading}
                  required
                />
              </div>
            </FormGroup>

            <FormGroup label="Description" helperText="Describe responsibilities and qualifications" required>
              <textarea
                className="w-full min-h-[180px] rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:focus:ring-blue-900"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Role responsibilities, requirements, perks"
                disabled={loading}
                required
              />
            </FormGroup>

            <div className="flex justify-end">
              <Button variant="primary" size="lg" disabled={loading} className="flex items-center gap-2">
                {loading ? 'Posting…' : 'Post Job'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}

