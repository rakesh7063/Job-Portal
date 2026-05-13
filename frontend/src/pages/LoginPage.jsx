import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../shared/api/apiClient.js'
import { login } from '../shared/api/authApi.js'
import { useAuth } from '../shared/auth/AuthProvider.jsx'
import { Button, Card, CardBody, FormGroup, Input } from '../components'
import { LogIn, AlertCircle, Mail, Lock } from 'lucide-react'

export function LoginPage() {
  const auth = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const from = loc.state?.from || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      const res = await login({ email, password })
      const backendName = typeof res?.name === 'string' ? res.name.trim() : ''
      const fallbackName = email?.includes('@') ? email.split('@')[0] : email
      auth.setAuth({
        token: res.token,
        role: res.role,
        name: backendName || fallbackName || null,
        email: typeof res?.email === 'string' ? res.email : email,
      })
      nav(from, { replace: true })
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2 : new Error('Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4 dark:bg-blue-900">
            <LogIn className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</h1>
          <p className="text-gray-600 mt-2 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardBody className="space-y-6">
            {/* Error Alert */}
            {err && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 dark:bg-red-900/20 dark:border-red-800">
                <AlertCircle className="text-red-600 flex-shrink-0 dark:text-red-400" size={20} />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 dark:text-red-100">Login failed</h3>
                  <p className="text-sm text-red-700 mt-1 dark:text-red-300">
                    {err?.message || 'Please check your credentials and try again.'}
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              <FormGroup label="Email Address" required>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10"
                    disabled={loading}
                    required
                  />
                </div>
              </FormGroup>

              <FormGroup label="Password" required>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    disabled={loading}
                    required
                  />
                </div>
              </FormGroup>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>

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
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
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
                <span className="px-2 bg-white text-gray-500 dark:bg-gray-900 dark:text-gray-400">New to Rojgar?</span>
              </div>
            </div>

            {/* Register Link */}
            <Link to="/register">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full"
              >
                Create Account
              </Button>
            </Link>
          </CardBody>
        </Card>

        {/* Demo Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Demo credentials:</span>
          </p>
          <p className="text-gray-600">
            Candidate: candidate@email.com / password
          </p>
          <p className="text-gray-600">
            Recruiter: recruiter@email.com / password
          </p>
        </div>
      </div>
    </div>
  )
}

