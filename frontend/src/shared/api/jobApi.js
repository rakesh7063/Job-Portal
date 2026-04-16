import { apiRequest } from './apiClient.js'

export function listJobs({ page = 0, size = 10 } = {}) {
  return apiRequest(`/api/jobs?page=${page}&size=${size}`)
}

export function searchJobs({ skills, skill, location, page = 0, size = 10 } = {}) {
  const params = new URLSearchParams()
  if (skills) params.set('skills', skills)
  else if (skill) params.set('skill', skill)
  if (location) params.set('location', location)
  params.set('page', String(page))
  params.set('size', String(size))
  return apiRequest(`/api/jobs/search?${params.toString()}`)
}

export function getJob(id) {
  return apiRequest(`/api/jobs/${id}`)
}

export function applyToJob(id) {
  return apiRequest(`/api/jobs/${id}/apply`, { method: 'POST' })
}

export function createJob(payload) {
  return apiRequest('/api/jobs', { method: 'POST', body: payload })
}

export function myJobs() {
  return apiRequest('/api/jobs/mine')
}

export function applicants(jobId) {
  return apiRequest(`/api/applications/${jobId}`)
}

