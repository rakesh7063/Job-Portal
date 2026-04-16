import { apiRequest } from './apiClient.js'

export function getCandidateProfile() {
  return apiRequest('/api/candidates/profile')
}

export function updateCandidateProfile(payload) {
  return apiRequest('/api/candidates/profile', { method: 'PUT', body: payload })
}

