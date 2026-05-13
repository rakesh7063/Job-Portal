import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../shared/api/apiClient.js'
import { forgotPassword } from '../shared/api/authApi.js'
import { Button, Card, CardBody, FormGroup, Input } from '../components'
import { KeyRound, AlertCircle, CheckCircle, Mail, Lock, ArrowRight } from 'lucide-react'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [ok, setOk] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    setOk('')
    try {
      const res = await forgotPassword({ email, password })
      setOk(typeof res === 'string' ? res : 'Password updated successfully! You can now login with your new password.')
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2 : new Error('Password update failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4">
            <KeyRound className="text-blue-600" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">
            Enter your email and a new password to regain access to your account
          </p>
        </div>

        {/* Password Reset Card */}
        <Card className="shadow-lg">
          <CardBody className="space-y-6">
            {/* Success Alert */}
            {ok && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3 animate-fade-in">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-green-900">Success!</h3>
                  <p className="text-sm text-green-700 mt-1">{ok}</p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-green-700 font-medium mt-2 hover:text-green-800"
                  >
                    Go to login
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {err && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900">Password update failed</h3>
                  <p className="text-sm text-red-700 mt-1">
                    {err?.message || 'Please check your email and try again.'}
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            {!ok && (
              <form onSubmit={onSubmit} className="space-y-4">
                <FormGroup label="Email Address" required>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
                  <p className="text-xs text-gray-500 mt-2">
                    We'll send a verification link to this email
                  </p>
                </FormGroup>

                <FormGroup
                  label="New Password"
                  required
                  helperText="Minimum 6 characters with uppercase, lowercase, number, and special character"
                >
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <KeyRound size={18} />
                      Update Password
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 dark:bg-gray-900 dark:text-gray-400">Remember your password?</span>
              </div>
            </div>

            {/* Back to Login Link */}
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full">
                Back to Login
              </Button>
            </Link>
          </CardBody>
        </Card>

        {/* Help Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm dark:bg-blue-900/20 dark:border-blue-800">
          <h4 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">Need help?</h4>
          <p className="text-gray-700 dark:text-gray-300">
            If you don't have access to your email or need further assistance, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}

