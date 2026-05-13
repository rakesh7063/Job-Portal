import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../shared/api/apiClient.js'
import { registerCandidate, registerRecruiter } from '../shared/api/authApi.js'
import { Button, Card, CardBody, FormGroup, Input, Badge } from '../components'
import { UserPlus, AlertCircle, CheckCircle, Building2, Code2 } from 'lucide-react'

export function RegisterPage() {
  const nav = useNavigate()
  const [type, setType] = useState('candidate') // candidate | recruiter

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('0')
  const [skills, setSkills] = useState('')
  const [location, setLocation] = useState('')

  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [ok, setOk] = useState('')

  const isRecruiter = type === 'recruiter'

  const payload = useMemo(() => {
    if (isRecruiter) {
      return { name, company, email, password }
    }
    return {
      name,
      email,
      password,
      experience: Number(experience || 0),
      skills,
      location,
    }
  }, [isRecruiter, name, company, email, password, experience, skills, location])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    setOk('')
    try {
      if (isRecruiter) await registerRecruiter(payload)
      else await registerCandidate(payload)
      setOk('Registration successful. You can now login.')
      setTimeout(() => nav('/login', { replace: true }), 500)
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2 : new Error('Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4 dark:bg-blue-900">
            <UserPlus className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create Account</h1>
          <p className="text-gray-600 mt-2 dark:text-gray-400">
            Join Rojgar and start your career journey today
          </p>
        </div>

        {/* Account Type Selector */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setType('candidate')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              type === 'candidate'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Code2 size={18} />
            I'm a Candidate
          </button>
          <button
            onClick={() => setType('recruiter')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              type === 'recruiter'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Building2 size={18} />
            I'm a Recruiter
          </button>
        </div>

        {/* Registration Card */}
        <Card className="shadow-lg">
          <CardBody className="space-y-6">
            {/* Success Alert */}
            {ok && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3 dark:bg-green-900/20 dark:border-green-800">
                <CheckCircle className="text-green-600 flex-shrink-0 dark:text-green-400" size={20} />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">Success!</h3>
                  <p className="text-sm text-green-700 mt-1 dark:text-green-300">{ok}</p>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {err && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 dark:bg-red-900/20 dark:border-red-800">
                <AlertCircle className="text-red-600 flex-shrink-0 dark:text-red-400" size={20} />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 dark:text-red-100">Registration failed</h3>
                  <p className="text-sm text-red-700 mt-1 dark:text-red-300">
                    {err?.message || 'Please check the form and try again.'}
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Name Field */}
              <FormGroup label="Full Name" required>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  disabled={loading}
                  required
                />
              </FormGroup>

              {/* Company/Experience */}
              {isRecruiter ? (
                <FormGroup label="Company Name" required>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company"
                    disabled={loading}
                    required
                  />
                </FormGroup>
              ) : (
                <FormGroup label="Experience (years)" helperText="Years of professional experience">
                  <Input
                    type="number"
                    min="0"
                    max="60"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="0"
                    disabled={loading}
                  />
                </FormGroup>
              )}

              {/* Email */}
              <FormGroup label="Email Address" required>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  required
                />
              </FormGroup>

              {/* Password */}
              <FormGroup
                label="Password"
                required
                helperText="Minimum 6 characters with uppercase, lowercase, number, and special character"
              >
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </FormGroup>

              {/* Candidate-specific fields */}
              {!isRecruiter && (
                <>
                  <FormGroup label="Skills" helperText="Comma separated (e.g., Java, Spring, React)">
                    <Input
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="Java, Spring, React"
                      disabled={loading}
                    />
                  </FormGroup>

                  <FormGroup label="Location" helperText="Your preferred work location">
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Kolkata, Mumbai, Remote"
                      disabled={loading}
                    />
                  </FormGroup>
                </>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 dark:bg-gray-900 dark:text-gray-400">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full">
                Sign In Instead
              </Button>
            </Link>
          </CardBody>
        </Card>

        {/* Info Box */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
            <Badge variant="primary" className="mb-2">For Candidates</Badge>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Create your profile, upload your resume, and apply to jobs in seconds.
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
            <Badge variant="success" className="mb-2">For Recruiters</Badge>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Post jobs, manage applications, and find the perfect candidates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

