import { apiRequest } from './apiClient.js'

export function getCandidateProfile() {
  return apiRequest('/api/candidates/profile')
}

export function updateCandidateProfile(payload) {
  return apiRequest('/api/candidates/profile', { method: 'PUT', body: payload })
}

export function uploadResume(file) {
  const formData = new FormData()
  formData.append('resume', file)
  return apiRequest('/api/candidates/profile/resume', { method: 'POST', body: formData })
}

export function getCandidateProfileById(candidateId) {
  return apiRequest(`/api/candidates/${candidateId}`)
}

export function analyzeJobApplicants(jobId) {
  return apiRequest(`/api/ai/jobs/${jobId}/analyze`, { method: 'POST' })
}

export function getApplicantSummaries(jobId) {
  return apiRequest(`/api/ai/jobs/${jobId}/applicants`)
}
export function analyzeCandidateForJob(jobId, candidateId) {
  return apiRequest(`/api/ai/jobs/${jobId}/candidates/${candidateId}/analyze`)
} 

export function downloadResume(jobId, candidateId) {
  return apiRequest(`/api/applications/${jobId}/candidates/${candidateId}/resume`, { responseType: 'blob' })
}

