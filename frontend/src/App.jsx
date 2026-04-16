import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './shared/layout/AppShell.jsx'
import { LandingPage } from './pages/LandingPage.jsx'
import { JobsPage } from './pages/JobsPage.jsx'
import { JobDetailsPage } from './pages/JobDetailsPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.jsx'
import { CandidateProfilePage } from './pages/candidate/CandidateProfilePage.jsx'
import { RecruiterMyJobsPage } from './pages/recruiter/RecruiterMyJobsPage.jsx'
import { RecruiterPostJobPage } from './pages/recruiter/RecruiterPostJobPage.jsx'
import { RecruiterApplicantsPage } from './pages/recruiter/RecruiterApplicantsPage.jsx'
import { RequireAuth } from './shared/auth/RequireAuth.jsx'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<LandingPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/candidate/profile"
          element={
            <RequireAuth allow={['ROLE_CANDIDATE']}>
              <CandidateProfilePage />
            </RequireAuth>
          }
        />

        <Route
          path="/recruiter/jobs"
          element={
            <RequireAuth allow={['ROLE_RECRUITER']}>
              <RecruiterMyJobsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/recruiter/jobs/new"
          element={
            <RequireAuth allow={['ROLE_RECRUITER']}>
              <RecruiterPostJobPage />
            </RequireAuth>
          }
        />
        <Route
          path="/recruiter/jobs/:jobId/applicants"
          element={
            <RequireAuth allow={['ROLE_RECRUITER']}>
              <RecruiterApplicantsPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
