import { apiRequest } from './apiClient.js'

export function login(payload) {
  return apiRequest('/api/auth/login', { method: 'POST', body: payload })
}

export function registerCandidate(payload) {
  return apiRequest('/api/auth/register/candidate', { method: 'POST', body: payload })
}

export function registerRecruiter(payload) {
  return apiRequest('/api/auth/register/recruiter', { method: 'POST', body: payload })
}

export function forgotPassword(payload) {
  return apiRequest('/api/auth/forgotPassword', { method: 'POST', body: payload })
}

