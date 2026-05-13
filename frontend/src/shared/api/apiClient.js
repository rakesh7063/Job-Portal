import { getStoredAuth } from '../auth/authStorage.js'

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function parseBody(res) {
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return await res.json()
  const text = await res.text()
  return text
}

export async function apiRequest(path, { method = 'GET', body, token, headers, responseType } = {}) {
  const auth = getStoredAuth()
  const effectiveToken = token ?? auth.token

  // Don't set Content-Type for FormData - let the browser set it with boundary
  const isFormData = body instanceof FormData

  const res = await fetch(path.startsWith('http') ? path : path, {
    method,
    headers: {
      ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {}),
      ...(headers || {}),
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  })

  if (res.status === 204) return null

  if (responseType === 'blob') {
    if (!res.ok) {
      const text = await res.text()
      const msg = text || `Request failed (${res.status})`
      throw new ApiError(msg, { status: res.status, data: text })
    }
    return await res.blob()
  }

  let data
  try {
    data = await parseBody(res)
  } catch {
    data = null
  }

  if (!res.ok) {
    const msg =
      (typeof data === 'object' && data && (data.message || data.error)) ||
      (typeof data === 'string' && data) ||
      `Request failed (${res.status})`
    throw new ApiError(msg, { status: res.status, data })
  }

  return data
}

