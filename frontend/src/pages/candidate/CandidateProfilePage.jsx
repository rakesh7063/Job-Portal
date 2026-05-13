import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApiError } from '../../shared/api/apiClient.js'
import { getCandidateProfile, getCandidateProfileById, updateCandidateProfile, uploadResume } from '../../shared/api/candidateApi.js'
import { useAuth } from '../../shared/auth/AuthProvider.jsx'
import { Button, Card, CardBody, CardHeader, FormGroup, Input, Badge, SkeletonLoader } from '../../components'
import { User, Mail, Code2, Briefcase, MapPin, AlertCircle, CheckCircle, Upload, FileText } from 'lucide-react'

export function CandidateProfilePage() {
  const auth = useAuth()
  const { candidateId } = useParams()
  const isRecruiterViewing = Boolean(candidateId)
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ name: '', experience: '0', skills: '', location: '' })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState(null)
  const [ok, setOk] = useState('')

  // Resume upload state
  const [resumeFile, setResumeFile] = useState(null)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [resumeUploadOk, setResumeUploadOk] = useState('')

  useEffect(() => {
    let alive = true
    const run = async () => {
      setLoading(true)
      setErr('')
      try {
        const res = candidateId
          ? await getCandidateProfileById(candidateId)
          : await getCandidateProfile()
        if (!alive) return
        setProfile(res)
        if (!candidateId && res?.name) {
          auth.setAuth({ token: auth.token, role: auth.role, name: res.name, email: res.email || auth.email })
        }
        setForm({
          name: res.name || '',
          experience: String(res.experience ?? 0),
          skills: res.skills || '',
          location: res.location || '',
        })
      } catch (e) {
        if (alive) setErr(e instanceof ApiError ? e : new Error('Failed to load profile'))
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
}, [candidateId])

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErr('')
    setOk('')
    try {
      const payload = {
        name: form.name,
        experience: Number(form.experience || 0),
        skills: form.skills,
        location: form.location,
      }
      const res = await updateCandidateProfile(payload)
      setProfile(res)
      if (res?.name) {
        auth.setAuth({ token: auth.token, role: auth.role, name: res.name, email: res.email || auth.email })
      }
      setOk('Profile updated successfully!')
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2 : new Error('Failed to update profile'))
    } finally {
      setSaving(false)
    }
  }

  const onUploadResume = async (e) => {
    e.preventDefault()
    if (!resumeFile) return

    setUploadingResume(true)
    setErr('')
    setResumeUploadOk('')
    try {
      await uploadResume(resumeFile)
      setResumeUploadOk('Resume uploaded successfully!')
      setResumeFile(null)
      // Reset file input
      e.target.reset()
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2 : new Error('Failed to upload resume'))
    } finally {
      setUploadingResume(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 dark:text-gray-100">
          <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/20">
            <User className="text-blue-600" size={28} />
          </div>
          {candidateId ? 'Candidate Profile' : 'Your Profile'}
        </h1>
        <p className="text-lg text-gray-600">
          {candidateId
            ? 'Review the candidate profile details as a recruiter.'
            : 'Keep your profile updated to help recruiters find the perfect match for you.'}
        </p>
      </div>

      {/* Status Messages */}
      {err && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 dark:bg-red-900/20 dark:border-red-800">
          <AlertCircle className="text-red-600 flex-shrink-0 dark:text-red-400" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-100">Error</h3>
            <p className="text-sm text-red-700 mt-1 dark:text-red-300">{err?.message || 'Request failed'}</p>
          </div>
        </div>
      )}

      {ok && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3 animate-fade-in dark:bg-green-900/20 dark:border-green-800">
          <CheckCircle className="text-green-600 flex-shrink-0 dark:text-green-400" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 dark:text-green-100">Success!</h3>
            <p className="text-sm text-green-700 mt-1 dark:text-green-300">{ok}</p>
          </div>
        </div>
      )}

      {/* Profile Info */}
      {loading ? (
        <div className="space-y-4">
          <SkeletonLoader className="h-32" />
          <SkeletonLoader className="h-96" />
        </div>
      ) : profile ? (
        <div className="space-y-6">
          {/* User Info Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-blue-800">
            <CardBody className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Full Name</h3>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{profile.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Email</h3>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{profile.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Experience</h3>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{profile.experience ?? 0} yrs</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Location</h3>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{profile.location || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 items-start">
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Candidate ID</h3>
                  <Badge variant="primary">{profile.id}</Badge>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Skills</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile.skills ? profile.skills.split(',').map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill.trim()}
                      </Badge>
                    )) : <span className="text-sm text-gray-600 dark:text-gray-400">No skills specified</span>}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {!isRecruiterViewing && (
            <>
              {/* Edit Profile Form */}
              <Card>
                <CardHeader className="bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 dark:text-gray-100">
                    <Briefcase size={20} className="text-blue-600" />
                    Edit Profile
                  </h2>
                </CardHeader>

                <CardBody>
                  <form onSubmit={onSave} className="space-y-6">
                {/* Name */}
                <FormGroup label="Full Name" required>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                    <Input
                      className="pl-10"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Your full name"
                      disabled={saving}
                      required
                    />
                  </div>
                </FormGroup>

                {/* Experience and Location */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormGroup label="Experience (years)" helperText="Years of professional experience">
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                      <Input
                        type="number"
                        min="0"
                        max="60"
                        className="pl-10"
                        value={form.experience}
                        onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                        placeholder="0"
                        disabled={saving}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup label="Location" helperText="Your preferred work location">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                      <Input
                        className="pl-10"
                        value={form.location}
                        onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                        placeholder="e.g., Kolkata, Mumbai, Remote"
                        disabled={saving}
                      />
                    </div>
                  </FormGroup>
                </div>

                {/* Skills */}
                <FormGroup
                  label="Skills"
                  helperText="Comma separated (e.g., Java, Spring Boot, React, AWS)"
                >
                  <div className="relative">
                    <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                    <Input
                      className="pl-10"
                      value={form.skills}
                      onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
                      placeholder="Java, Spring, React, AWS"
                      disabled={saving}
                    />
                  </div>
                </FormGroup>

                {/* Skills Preview */}
                {form.skills && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                    <p className="text-sm text-gray-600 mb-3 dark:text-gray-400">Your skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {form.skills
                        .split(',')
                        .map((skill, idx) => (
                          <Badge key={idx} variant="primary">
                            {skill.trim()}
                          </Badge>
                        ))
                        .filter(Boolean)}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Briefcase size={18} />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Resume Upload */}
              <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Resume</h3>
                <form onSubmit={onUploadResume} className="space-y-4">
                  <FormGroup label="Upload Resume" helperText="Supported formats: PDF, DOC, DOCX (Max 5MB)">
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingResume}
                      />
                      <div className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors dark:border-gray-600 dark:hover:border-blue-500">
                        <Upload className="text-gray-400 dark:text-gray-500" size={24} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {resumeFile ? resumeFile.name : 'Click to upload your resume'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {resumeFile ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOC, DOCX up to 5MB'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </FormGroup>

                  {resumeUploadOk && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2 dark:bg-green-900/20 dark:border-green-800">
                      <CheckCircle className="text-green-600 flex-shrink-0 dark:text-green-400" size={16} />
                      <p className="text-sm text-green-700 dark:text-green-300">{resumeUploadOk}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="outline"
                    size="md"
                    disabled={!resumeFile || uploadingResume}
                    className="flex items-center gap-2"
                  >
                    {uploadingResume ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FileText size={18} />
                        Upload Resume
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </CardBody>
          </Card>

          {/* Profile Tips */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="bg-yellow-100 border-b border-yellow-200">
              <h3 className="font-semibold text-yellow-900">💡 Pro Tips</h3>
            </CardHeader>
            <CardBody className="space-y-2 text-sm text-yellow-800">
              <p>• Keep your skills list up-to-date with your latest technologies</p>
              <p>• Specify a preferred location or indicate if you're open to remote work</p>
              <p>• Your profile helps recruiters match you with relevant job opportunities</p>
            </CardBody>
          </Card>
            </>
          )}
        </div>
      ) : (
        <Card>
          <CardBody className="py-12 text-center">
            <p className="text-lg text-gray-600">No profile data available</p>
          </CardBody>
        </Card>
      )}
    </div>
  )
}

