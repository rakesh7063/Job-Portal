import { Link } from 'react-router-dom'
import { useAuth } from '../shared/auth/AuthProvider.jsx'
import { Button, Card, CardBody, Badge } from '../components'
import { Briefcase, Users, Zap, CheckCircle, Search, FileText } from 'lucide-react'

export function LandingPage() {
  const auth = useAuth()

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="gradient-hero rounded-2xl p-8 md:p-16 border border-gray-200 dark:border-gray-700">
        <div className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
              Hire faster.
              <br />
              <span className="text-gradient">Apply smarter.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-xl dark:text-gray-400">
              A secure job portal with JWT authentication, role-based access, and a seamless workflow for recruiters and candidates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/jobs">
              <Button variant="primary" size="lg" className="flex items-center gap-2">
                <Briefcase size={20} />
                Browse Jobs
              </Button>
            </Link>
            {!auth.isAuthed ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="secondary" size="lg">
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <Badge variant="success" className="h-fit">
                ✓ Welcome back!
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* For Candidates */}
        <Card className="card-hover overflow-hidden">
          <CardBody>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                <Search className="text-blue-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">For Candidates</h3>
                <p className="text-gray-600 mt-2">
                  Search jobs by skills and location, view detailed descriptions, and apply in one click.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="primary">Smart Search</Badge>
                  <Badge variant="primary">Easy Profile</Badge>
                  <Badge variant="primary">Quick Apply</Badge>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* For Recruiters */}
        <Card className="card-hover overflow-hidden">
          <CardBody>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900/20">
                <Users className="text-green-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">For Recruiters</h3>
                <p className="text-gray-600 mt-2">
                  Post jobs instantly, track your postings in real-time, and review qualified candidates effortlessly.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="success">Post Instantly</Badge>
                  <Badge variant="success">Manage Postings</Badge>
                  <Badge variant="success">Review Candidates</Badge>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Key Features Section */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Why Choose Rojgar?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="text-blue-600" size={20} />
              <h4 className="font-semibold text-gray-900">Fast & Secure</h4>
            </div>
            <p className="text-sm text-gray-600">
              Enterprise-grade security with JWT authentication and role-based access control.
            </p>
          </div>

          <div className="p-6 bg-green-50 rounded-lg border border-green-100 dark:bg-green-900/20 dark:border-green-800">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="text-green-600" size={20} />
              <h4 className="font-semibold text-gray-900">User-Friendly</h4>
            </div>
            <p className="text-sm text-gray-600">
              Clean, intuitive interface designed for both job seekers and recruiters.
            </p>
          </div>

          <div className="p-6 bg-purple-50 rounded-lg border border-purple-100 dark:bg-purple-900/20 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="text-purple-600" size={20} />
              <h4 className="font-semibold text-gray-900">Resume Upload</h4>
            </div>
            <p className="text-sm text-gray-600">
              Support for resume uploads and profile management for better opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 border-0 text-white overflow-hidden">
        <CardBody className="py-12 text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-blue-50 max-w-2xl mx-auto">
            Join thousands of job seekers and recruiters using Rojgar to connect and grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/jobs">
              <Button variant="secondary" size="lg" className="flex items-center gap-2">
                <Briefcase size={20} />
                Browse Open Jobs
              </Button>
            </Link>
            {!auth.isAuthed && (
              <Link to="/register">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white border border-white hover:bg-white hover:bg-opacity-10"
                >
                  Create Account
                </Button>
              </Link>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

